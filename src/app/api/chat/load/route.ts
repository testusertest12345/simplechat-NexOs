import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Message = {
  id: number;
  text: string;
  from: "bot" | string;
  time: string;
};

const dbFile = path.join(process.cwd(), "chat.db");

export async function GET() {
  try {
    let messages: Message[] = [];
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, "utf-8");
      messages = JSON.parse(raw);
    }

    if (messages.length > 20) {
      messages = messages.slice(-20);
      fs.writeFileSync(dbFile, JSON.stringify(messages, null, 2));
    }
    const latestMessages = messages.slice(-10);

    return NextResponse.json(latestMessages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
