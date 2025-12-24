import transporter from "../../config/mailer.js";

export const sendMail = async (req, res) => {
  const { fname, lname, email, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact form message from ${fname}`,
      html: `
        <h3>New Message</h3>
        <p><strong>Name:</strong> ${fname} ${lname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>

      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Mail send successfully", user: email });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error while sending mail" });
  }
};
