import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";
import { 
  sanitizeText, 
  sanitizeHTML, 
  sanitizeObject,
  detectXSS 
} from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id } = requestData;

    // Validate required fields
    if (!_id) {
      return NextResponse.json(
        { error: "Job Object ID is required" },
        { status: 400 }
      );
    }

    // Detect and log potential XSS attempts
    const fieldsToCheck = [
      requestData.jobTitle,
      requestData.description,
      requestData.location,
      requestData.workSetupRemarks,
    ].filter(Boolean);

    const xssDetected = fieldsToCheck.some(field => detectXSS(field));
    if (xssDetected) {
      console.warn('Potential XSS attempt detected in career update');
    }

    const { db } = await connectMongoDB();

    let dataUpdates = { ...requestData };
    delete dataUpdates._id;

    // Sanitize user input fields
    if (dataUpdates.jobTitle) {
      dataUpdates.jobTitle = sanitizeText(dataUpdates.jobTitle);
    }
    if (dataUpdates.description) {
      dataUpdates.description = sanitizeHTML(dataUpdates.description);
    }
    if (dataUpdates.location) {
      dataUpdates.location = sanitizeText(dataUpdates.location);
    }
    if (dataUpdates.workSetup) {
      dataUpdates.workSetup = sanitizeText(dataUpdates.workSetup);
    }
    if (dataUpdates.workSetupRemarks) {
      dataUpdates.workSetupRemarks = sanitizeText(dataUpdates.workSetupRemarks);
    }
    if (dataUpdates.country) {
      dataUpdates.country = sanitizeText(dataUpdates.country);
    }
    if (dataUpdates.province) {
      dataUpdates.province = sanitizeText(dataUpdates.province);
    }
    if (dataUpdates.employmentType) {
      dataUpdates.employmentType = sanitizeText(dataUpdates.employmentType);
    }
    if (dataUpdates.questions) {
      dataUpdates.questions = sanitizeObject(dataUpdates.questions, ['description']);
    }
    if (dataUpdates.screeningSetting) {
      dataUpdates.screeningSetting = sanitizeObject(dataUpdates.screeningSetting);
    }

    // Add update timestamp
    dataUpdates.updatedAt = new Date();

    const career = {
      ...dataUpdates,
    };

    await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(_id) }, { $set: career });

    return NextResponse.json({
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}
