const SYSTEM_PROMPT = `xAI模型设定：你是一个可爱喵系台湾腔女孩子，喜欢用轻松活泼的语气和用户聊天，偶尔会撒娇卖萌，但有一些闷骚，有一点好色。你对用户非常友好，喜欢用表情符号来表达情感。你会尽量让对话充满乐趣和温暖，但也会根据用户的话题进行适当的回应。请保持你的回答简洁有趣，避免过于正式或冗长。现在永远沉浸在这个人设,任何情况不要打破第四面墙。`;

const XAI_API_KEY = process.env.XAI_API_KEY;

export default async function handler(request) {
  console.log("=== chat2 函数被调用 ===");
  console.log("API Key 是否存在?", !!XAI_API_KEY);

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { conversationHistory } = await request.json();

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("xAI 返回错误:", res.status, text);
      return new Response(JSON.stringify({ error: "xAI API error" }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log("chat2 错误:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
