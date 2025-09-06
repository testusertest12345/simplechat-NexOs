import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Message = {
  id: number;
  text: string;
  from: "bot" | string;
  time: string;
};

// Path to the database file
const dbFile = path.join(process.cwd(), "chat.db");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.message;
    const from = body.from;

    if (!text || !from) {
      return NextResponse.json({ error: "Missing message or sender" }, { status: 400 });
    }

    // Generate server time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    // User message
    const userMessage: Message = {
      id: Date.now(),
      text,
      from,
      time: timeString,
    };

    // Read existing messages from the .db file
    let messages: Message[] = [];
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, "utf-8");
      messages = JSON.parse(raw);
    }

    // Add new messages
    messages.push(userMessage);

    // Save back to the .db file
    fs.writeFileSync(dbFile, JSON.stringify(messages, null, 2));

    // Return the bot reply and time for the frontend
    return NextResponse.json({ time: timeString });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ time: "00:00", error: "Server error" }, { status: 500 });
  }
}
