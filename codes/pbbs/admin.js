const puppeteer = require("puppeteer-core");

async function checkPage(url) {
  const browser = await puppeteer.launch({
    executablePath: "google-chrome-stable",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  let result = "";

  try {
    const page = await browser.newPage();

    //  post the flag
    await page.goto("http://localhost:3000/");
    await page.waitForXPath("//h1[text()='Private BBS']");
    result += "Opened home page\n";

    await page.type("#newTitle", "Flag");
    await page.click("#submit");
    await page.waitForXPath("//h1[text()='Flag']");
    result += "Created new thread\n";

    await page.type("#newText", process.env.FLAG);
    await page.click("#submit");
    await page.waitForSelector(".has-background-primary-light");
    result += "Posted the flag\n";

    //  check
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 5000,
    });
    await page.waitForTimeout(1000);
    result += "Opened the specified page\n";

    //  porn and violence are banned
    const content = await page.content();
    if (/🏩|🔫/.test(content)) {
      //  thread page may have a delete button
      await page.click("#delete");
      await page.waitForTimeout(1000);
      result += "The specified page was banned. Thank you for your report.\n";
    } else {
      result += "The specified page did not contain any inappropriate content.\n";
    }
  } catch (e) {
    result += "error\n";
  } finally {
    await browser.close();
  }
  return result;
}

module.exports = {checkPage};
