import transporter from "./mailer.js";
import fetch from "node-fetch";

export async function sendEmails(email, categories) {

  try {
    const apiKey = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${categories}&apiKey=${apiKey}`
    );
    const data = await response.json();
    const articles = data.articles.slice(0, 10);

    const emailContent = `
          <h3>Latest ${categories} News</h3>
          <ul>
            ${articles
        .map(
          (article) => `
              <li>
                <a href="${article.url}" target="_blank">${article.title}</a>
                <p>${article.description}</p>
              </li>
            `
        )
        .join("")}
          </ul>
        `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Latest ${categories} News`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("Emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};
