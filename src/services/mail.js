import nodemailer from 'nodemailer';
import 'dotenv/config';

let tranporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAILER_ID,
    pass: process.env.GOOGLE_MAILER_PW,
  },
});

async function mailer(email, randomNumber) {
  const info = await tranporter.sendMail({
    from: process.env.GMAIL_MAILER_ID,
    to: email,
    subject: '비밀번호 변경',
    html: `
    <body>
    <main>
      <div
        style="box-sizing: border-box; margin: auto; width: 640px; height: 901px"
      >
        <div
          style="
            width: 639px;
            height: 313px;
            left: 1px;
            top: 0px;
            background: rgba(82, 79, 161, 0.3);
          "
        >
          <div
            style="
              width: 273px;
              height: 26px;
              padding-left: 183px;
              padding-top: 118px;
              font-family: 'Noto Sans KR';
              font-style: normal;
              font-weight: 700;
              font-size: 15px;
              line-height: 22px;
              text-align: center;
            "
          >
            <span style="color: #524fa1">딍굴딍굴</span>을 다시 찾아주셔서
            감사합니다
          </div>
          <div
            style="
              width: 273px;
              height: 72px;
              padding-left: 183px;
              font-family: 'Noto Sans KR';
              font-style: normal;
              font-weight: 700;
              font-size: 40px;
              line-height: 58px;
              text-align: center;
              color: #000000;
            "
          >
            비밀번호 변경
          </div>
        </div>
        <div
          style="
            width: 494px;
            height: 35px;
            padding-left: 82px;
            padding-top: 20px;
            font-family: 'Noto Sans KR';
            color: #000000;
          "
        >
          <h2>안녕하세요, 고객님</h2>
        </div>
        <div
          style="
            width: 494px;
            height: 60px;
            padding-left: 82px;
            padding-top: 50px;
            font-family: 'Noto Sans KR';
            font-style: bold;
            font-weight: 500;
            font-size: 17px;
            line-height: 26px;
            color: #000000;
          "
        >
          아래의 버튼을 클릭하시면 비밀번호를 변경할 수 있는 페이지로 이동합니다.
        </div>
        <br />
        <br />
        <br />
        <a
          href="http://localhost:5000/api/newPassword/${randomNumber}"
          style="
            width: 179px;
            height: 60px;
            margin-left: 230px;
            padding: 15px 25px;
            text-align: center;
            text-decoration: none;
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 23px;
            background: #524fa1;
            color: #ffffff;
            border-radius: 20px;
          "
          >비밀번호변경</a
        >
        <div
          style="
            width: 532px;
            height: 30px;
            padding-left: 54px;
            padding-top: 90px;
            padding-bottom: 100px;
            font-family: 'sans-serif';
            font-style: bold;
            font-weight: 900;
            font-size: 17px;
            line-height: 26px;
            text-align: center;
            color: rgba(0, 0, 0, 0.7);
          "
        >
          위의 링크는 메일이 발송한 시점부터 <span style="color: #524fa1"
            >48시간</span
          >만 유효 합니다.
        </div>
        <footer
          style="
            width: 640px;
            height: 92px;
            padding-left: 10px;
            padding-top: 20px;
            border-top: 2px solid #d1d1d1;
          "
        >
          <div>
            <img
              style="width: 80px; height: 80px; float: left"
              src="https://i.imgur.com/TQfwNmH.png?1"
              alt="logo"
            />
            <div
              style="
                width: 500px;
                height: 23px;
                margin-left: 107px;
                top: 18px;
                font-family: 'Noto Sans KR';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                color: #959595;
              "
            >
              캠핑장 주소 : 52234 경상남도 산청군 시천면 남명로 376
            </div>
            <div
              style="
                width: 500px;
                height: 26px;
                margin-left: 107px;
                top: 30px;
                font-family: 'Noto Sans KR';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                display: flex;
                align-items: center;
                color: #959595;
              "
            >
              사업자등록번호 : 654-88-45613 대표전화 : 010-4567-3210
            </div>
            <div
              style="
                width: 500px;
                height: 26px;
                margin-left: 107px;
                top: 50px;
                font-family: 'Noto Sans KR';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                display: flex;
                align-items: center;
                color: #959595;
              "
            >
              Copyright © Korea National Park Service. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </main>
  </body>
  
    `,
  });
  return info;
}

export { mailer };
