import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import { 
  sanitizeText, 
  sanitizeHTML, 
  sanitizeObject,
  validateCareerData,
  detectXSS 
} from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    // Validate career data structure
    const validation = validateCareerData(rawData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Detect and log potential XSS attempts
    const fieldsToCheck = [
      rawData.jobTitle,
      rawData.description,
      rawData.location,
      rawData.workSetupRemarks,
    ].filter(Boolean);

    const xssDetected = fieldsToCheck.some(field => detectXSS(field));
    if (xssDetected) {
      console.warn('Potential XSS attempt detected in career post submission');
    }

    // Sanitize all input fields
    const jobTitle = sanitizeText(rawData.jobTitle);
    const description = sanitizeHTML(rawData.description); // Allow safe HTML
    const location = sanitizeText(rawData.location);
    const workSetup = sanitizeText(rawData.workSetup);
    const workSetupRemarks = rawData.workSetupRemarks 
      ? sanitizeText(rawData.workSetupRemarks) 
      : undefined;
    const country = rawData.country ? sanitizeText(rawData.country) : undefined;
    const province = rawData.province ? sanitizeText(rawData.province) : undefined;
    const employmentType = rawData.employmentType 
      ? sanitizeText(rawData.employmentType) 
      : undefined;

    // Sanitize questions array (preserve structure but sanitize content)
    const questions = rawData.questions 
      ? sanitizeObject(rawData.questions, ['description']) 
      : [];

    // Sanitize screening settings if present
    const screeningSetting = rawData.screeningSetting
      ? sanitizeObject(rawData.screeningSetting)
      : undefined;

    // Pass through non-user-input fields (these come from authenticated session)
    const {
      lastEditedBy,
      createdBy,
      orgID,
      requireVideo,
      status,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
    } = rawData;

    // Validate required fields after sanitization
    if (!jobTitle || !description || !location || !workSetup) {
      return NextResponse.json(
        {
          error:
            "Job title, description, location and work setup are required",
        },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const orgDetails = await db.collection("organizations").aggregate([
      {
        $match: {
          _id: new ObjectId(orgID)
        }
      },
      {
        $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
                {
                    $addFields: {
                        _id: { $toString: "$_id" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$planId"] }
                    }
                }
            ],
            as: "plan"
        }
      },
      {
        $unwind: "$plan"
      },
    ]).toArray();

    if (!orgDetails || orgDetails.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

    if (totalActiveCareers >= (orgDetails[0].plan.jobLimit + (orgDetails[0].extraJobSlots || 0))) {
      return NextResponse.json({ error: "You have reached the maximum number of jobs for your plan" }, { status: 400 });
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: status || "active",
      screeningSetting,
      orgID,
      requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
    };

    await db.collection("careers").insertOne(career);

    return NextResponse.json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
