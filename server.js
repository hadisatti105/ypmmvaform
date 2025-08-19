const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();

// Render (or local) port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to handle form submission
app.post("/submit-lead", async (req, res) => {
  try {
    const formData = req.body;

    // Build payload for TrackDrive
    const payload = {
      lead_token: "dfff45cbe4d94cc2918466e6c06b5433", // static
      traffic_source_id: "1002", // static
      caller_id: formData.caller_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      zip: formData.zip,
      state: formData.state,
      trusted_form_cert_url: formData.trusted_form_cert_url || "Example",

      // Accident/Case fields (optional)
      accident_state: formData.accident_state || "",
      accident_type: formData.accident_type || "",
      needs_attorney: formData.needs_attorney || "",
      hospitalized_or_treated: formData.hospitalized_or_treated || "",
      date_injured: formData.date_injured || "",
      person_at_fault: formData.person_at_fault || "",
      area_of_practice: "motor_vehicle_accident",

      // Required fields from API
      currently_represented: formData.currently_represented || "no",
      comments: formData.comments || "Submitted via web form"
    };

    // Send to TrackDrive API
    const response = await axios.post(
      "https://ypm-leads.trackdrive.com/api/v1/leads",
      payload
    );

    res.json({ success: true, trackdrive_response: response.data });
  } catch (error) {
    console.error("❌ Error submitting lead:", error.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, error: error.response?.data || error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
