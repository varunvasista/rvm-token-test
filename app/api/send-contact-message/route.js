import { errorHandler } from "@/middlewares/error";
import sendEmail from "@/utils/sendEmail";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { name, email, telegram, message } = await req.json();

        if (!name || !email || !message)
            return errorHandler(400, "Please Enter All fields");

        const mess = `This Contact Form was Submitted on RVM Token Website:\n\n
Name: ${name} \n
Email: ${email} \n
Telegram: ${telegram} \n
Message: ${message} \n
    `;

        // Send email
        await sendEmail({
            email: process.env.RVM_TOKEN_MAIL,
            subject: `RVM Token Contact Form Submitted by ${name}`,
            message: mess,
        });

        return NextResponse.json({
            success: true,
            message: `Form sent successfully`,
        }, {
            status: 200
        });
    } catch (error) {
        return errorHandler(500, "Something Went Wrong");
    }
}