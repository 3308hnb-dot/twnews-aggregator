import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const sources = [
      { name: "中评社", url: "https://www.crntt.com/crn-webapp/msgOutline.jsp?coluid=46" },
      { name: "联合新闻网", url: "https://udn.com/news/breaknews/1/1" },
      { name: "中央社", url: "https://www.cna.com.tw/list/aipl.aspx" },
      { name: "中时新闻网", url: "https://www.chinatimes.com/politic/?chdtv" },
      { name: "自由时报军武", url: "https://def.ltn.com.tw/" },
      { name: "梅花新闻网", url: "https://www.i-meihua.com/Article?type=1" },
      { name: "联合早报中国", url: "https://www.zaobao.com.sg/realtime/china" }
    ];

    let allNews = [];

    for (const src of sources) {
      const html = (await axios.get(src.url)).data;
      const $ = cheerio.load(html);

      let articles = [];

      $("h2, h3, .title, .news_title").each((i, el) => {
        if (i >= 3) return;

        const title = $(el).text().trim();
        if (!title) return;

        articles.push({
          source: src.name,
          title: title,
          url: src.url,
          time: new Date().toISOString(),
        });
      });

      allNews.push(...articles);
    }

    res.status(200).json({ updated: new Date(), data: allNews });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
