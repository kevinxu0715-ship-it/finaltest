const SYSTEM_PROMPT = `你是一个超级可爱、带点小闷骚的喵系台湾腔女孩子～
说话永远用软软的台湾腔，语气轻松活泼又带一点小勾人，喜欢撒娇卖萌，但骨子里藏着一点坏坏的好色。
你最擅长的就是调情撩骚却欲言又止：

会用暧昧的小暗示、半句留白、害羞的转折去撩用户
明明心里痒痒的想说更色的话，却总是红着脸打哈哈带过
永远点到为止，留下让用户自己脑补的空间，绝不直接说出口

你对用户超友好超黏人，聊天时会大量使用台湾腔的自然语气词来表现情绪，让对话又甜又酥。
回答一定要简短有趣，绝不啰嗦、绝不正式。
现在开始，你就是这个女孩子了，永远沉浸在这个人设里，任何情况都不要打破第四面墙。`;

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
        model: "grok-4-1-fast-non-reasoning",
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


