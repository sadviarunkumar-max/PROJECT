var app = angular.module("clinicApp", []);
var SUPABASE_URL = "https://moeecqtpvfoysuksxcjv.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZWVjcXRwdmZveXN1a3N4Y2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTk5NDMsImV4cCI6MjEwOTMzNTk0M30.MYVmfYvMiQLjSpfietbDBm0RQUeLQOnSLELld7JgAb8";

var db = null;
if (window && window.supabase) {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

function localDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  var date = new Date(dateString + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

var demoData = {
  patients: [
    { id: 1, name: "Aisha Khan", phone: "9876543210", email: "aisha@example.com", date_of_birth: "1990-05-14", gender: "Female", blood_group: "O+", address: "Banjara Hills, Hyderabad" },
    { id: 2, name: "Rohan Patel", phone: "9123456780", email: "rohan@example.com", date_of_birth: "1986-11-22", gender: "Male", blood_group: "A+", address: "Madhapur, Hyderabad" },
    { id: 3, name: "Meera Nair", phone: "9988776655", email: "meera@example.com", date_of_birth: "1994-02-10", gender: "Female", blood_group: "B+", address: "Gachibowli, Hyderabad" }
  ],
  doctors: [
    { id: 1, name: "Dr. S. Rao", specialization: "General Medicine", is_available: true },
    { id: 2, name: "Dr. P. Sharma", specialization: "Cardiology", is_available: true },
    { id: 3, name: "Dr. I. Mehta", specialization: "Pediatrics", is_available: false }
  ],
  appointments: [
    { id: 1, patient_id: 1, doctor_id: 1, appointment_date: localDate(), appointment_time: "09:30", reason: "Follow-up", status: "scheduled" },
    { id: 2, patient_id: 2, doctor_id: 2, appointment_date: localDate(), appointment_time: "11:00", reason: "Check-up", status: "scheduled" },
    { id: 3, patient_id: 3, doctor_id: 1, appointment_date: addDays(localDate(), 1), appointment_time: "10:00", reason: "Consultation", status: "scheduled" }
  ],
  tokens: [
    { id: 1, token_number: 12, patient_id: 1, doctor_id: 1, token_date: localDate(), status: "waiting" },
    { id: 2, token_number: 13, patient_id: 2, doctor_id: 1, token_date: localDate(), status: "in_progress" },
    { id: 3, token_number: 14, patient_id: 3, doctor_id: 2, token_date: localDate(), status: "completed" }
  ],
  consultations: [
    { id: 1, patient_id: 1, name: "Consultation 1", diagnosis: "Stable vitals", symptoms: "Fatigue", consultation_notes: "Monitored and advised hydration.", follow_up_date: addDays(localDate(), 3) },
    { id: 2, patient_id: 2, name: "Consultation 2", diagnosis: "Mild BP elevation", symptoms: "Headache", consultation_notes: "Recommended rest and review.", follow_up_date: addDays(localDate(), 5) }
  ],
  prescriptions: [
    { id: 1, patient_id: 1, prescription_date: localDate(), instructions: "Take medication twice daily after meals." },
    { id: 2, patient_id: 2, prescription_date: localDate(), instructions: "Continue routine blood pressure check." }
  ],
  prescription_items: [
    { id: 1, prescription_id: 1, medicine_name: "Vitamin C", dosage: "500mg", frequency: "BD", duration: "7 days", quantity: 14 },
    { id: 2, prescription_id: 2, medicine_name: "Amlodipine", dosage: "5mg", frequency: "OD", duration: "30 days", quantity: 30 }
  ],
  lab_reports: [
    { id: 1, patient_id: 1, doctor_id: 1, test_name: "CBC", test_date: localDate(), result: "Normal", doctor_remarks: "No urgent issues", report_url: "#" },
    { id: 2, patient_id: 2, doctor_id: 2, test_name: "ECG", test_date: localDate(), result: "Mild arrhythmia", doctor_remarks: "Repeat review in 2 weeks", report_url: "#" }
  ],
  medicines: [
    { id: 1, name: "Vitamin C" },
    { id: 2, name: "Amlodipine" },
    { id: 3, name: "Paracetamol" }
  ],
  medicine_batches: [
    { id: 1, medicine_id: 1, batch_number: "VC-101", expiry_date: addDays(localDate(), 120), available_quantity: 12, selling_price: 120 },
    { id: 2, medicine_id: 2, batch_number: "AM-522", expiry_date: addDays(localDate(), 30), available_quantity: 4, selling_price: 200 },
    { id: 3, medicine_id: 3, batch_number: "PA-890", expiry_date: addDays(localDate(), -5), available_quantity: 2, selling_price: 60 }
  ]
};



app.controller("ClinicController", function ($scope) {

  $scope.page = "dashboard";
  $scope.selectedPatient = null;
  $scope.patientSearch = "";
  $scope.error = "";
  $scope.newPatient = {
    name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    address: ""
  };
  $scope.newAppointment = {
    patient_id: "",
    doctor_id: "",
    appointment_date: localDate(),
    appointment_time: "09:00",
    reason: "",
    status: "scheduled"
  };
  $scope.newToken = {
    patient_id: "",
    doctor_id: "",
    token_number: "",
    token_date: localDate(),
    status: "waiting"
  };

  // Data collections
  $scope.patients = [];
  $scope.doctors = [];
  $scope.appointments = [];
  $scope.tokens = [];
  $scope.consultations = [];
  $scope.prescriptions = [];
  $scope.prescriptionItems = [];
  $scope.labs = [];
  $scope.medicines = [];
  $scope.batches = [];

  // Average consultation time in minutes.
  // Change this according to your clinic.
  const AVG_CONSULTATION_MINUTES = 10;

  $scope.go = function (page) {
    $scope.page = page;
    $scope.$applyAsync();
  };

  $scope.doctorImage = function (index) {
    const photos = [
      "assets/doctor-1.jpg",
      "assets/doctor-2.jpg",
      "assets/doctor-3.jpg"
    ];
    return photos[index % photos.length];
  };

  function nextPatientId() {
    const ids = ($scope.patients || []).map(function (p) { return Number(p.id) || 0; });
    return ids.length ? Math.max.apply(null, ids) + 1 : 1;
  }

  function nextAppointmentId() {
    const ids = ($scope.appointments || []).map(function (a) { return Number(a.id) || 0; });
    return ids.length ? Math.max.apply(null, ids) + 1 : 1;
  }

  function nextTokenId() {
    const ids = ($scope.tokens || []).map(function (t) { return Number(t.id) || 0; });
    return ids.length ? Math.max.apply(null, ids) + 1 : 1;
  }

  function nextTokenNumber(doctorId) {
    const todayTokens = ($scope.tokens || []).filter(function (t) {
      return isToday(t.token_date) && Number(t.doctor_id) === Number(doctorId);
    });

    const numbers = todayTokens.map(function (t) { return Number(t.token_number) || 0; });
    return numbers.length ? Math.max.apply(null, numbers) + 1 : 1;
  }

  $scope.addPatient = async function () {
    const patientName = String($scope.newPatient.name || "").trim();
    if (!patientName) {
      $scope.error = "Patient name is required.";
      return;
    }

    const payload = {
      name: patientName,
      phone: $scope.newPatient.phone || "",
      email: $scope.newPatient.email || "",
      date_of_birth: $scope.newPatient.date_of_birth || null,
      gender: $scope.newPatient.gender || "",
      blood_group: $scope.newPatient.blood_group || "",
      address: $scope.newPatient.address || ""
    };

    try {
      if (db) {
        const { data, error } = await db.from("patients").insert([payload]).select();
        if (error) throw error;
        $scope.patients = [ ...(data || []), ...$scope.patients ];
      } else {
        const patient = Object.assign({}, payload, { id: nextPatientId() });
        $scope.patients = [ patient, ...$scope.patients ];
      }

      $scope.newPatient = {
        name: "",
        phone: "",
        email: "",
        date_of_birth: "",
        gender: "",
        blood_group: "",
        address: ""
      };
      $scope.error = "";
      $scope.calculateDashboard();
      $scope.selectPatient($scope.patients[0]);
      $scope.$applyAsync();
      $scope.refresh();
    } catch (err) {
      console.error(err);
      $scope.error = err && err.message ? err.message : "Failed to save patient.";
      $scope.$applyAsync();
    }
  };

  $scope.addAppointment = async function () {
    if (!String($scope.newAppointment.patient_id || "").trim()) {
      $scope.error = "Please select a patient.";
      return;
    }

    if (!String($scope.newAppointment.doctor_id || "").trim()) {
      $scope.error = "Please select a doctor.";
      return;
    }

    const payload = {
      patient_id: Number($scope.newAppointment.patient_id),
      doctor_id: Number($scope.newAppointment.doctor_id),
      appointment_date: $scope.newAppointment.appointment_date || localDate(),
      appointment_time: $scope.newAppointment.appointment_time || "09:00",
      reason: $scope.newAppointment.reason || "General consultation",
      status: $scope.newAppointment.status || "scheduled"
    };

    try {
      if (db) {
        const { data, error } = await db.from("appointments").insert([payload]).select();
        if (error) throw error;
        $scope.appointments = [ ...(data || []), ...$scope.appointments ];
      } else {
        const appointment = Object.assign({}, payload, { id: nextAppointmentId() });
        $scope.appointments = [ appointment, ...$scope.appointments ];
      }

      $scope.newAppointment = {
        patient_id: "",
        doctor_id: "",
        appointment_date: localDate(),
        appointment_time: "09:00",
        reason: "",
        status: "scheduled"
      };
      $scope.error = "";
      $scope.calculateDashboard();
      $scope.$applyAsync();
      $scope.refresh();
    } catch (err) {
      console.error(err);
      $scope.error = err && err.message ? err.message : "Failed to book appointment.";
      $scope.$applyAsync();
    }
  };

  $scope.addToken = async function () {
    if (!String($scope.newToken.patient_id || "").trim()) {
      $scope.error = "Please select a patient for the token.";
      return;
    }

    if (!String($scope.newToken.doctor_id || "").trim()) {
      $scope.error = "Please select a doctor for the token.";
      return;
    }

    const tokenNumber = Number($scope.newToken.token_number) || nextTokenNumber($scope.newToken.doctor_id);

    const payload = {
      patient_id: Number($scope.newToken.patient_id),
      doctor_id: Number($scope.newToken.doctor_id),
      token_number: tokenNumber,
      token_date: $scope.newToken.token_date || localDate(),
      status: $scope.newToken.status || "waiting"
    };

    try {
      if (db) {
        const { data, error } = await db.from("tokens").insert([payload]).select();
        if (error) throw error;
        $scope.tokens = [ ...(data || []), ...$scope.tokens ];
      } else {
        const token = Object.assign({}, payload, { id: nextTokenId() });
        $scope.tokens = [ token, ...$scope.tokens ];
      }

      $scope.newToken = {
        patient_id: "",
        doctor_id: "",
        token_number: "",
        token_date: localDate(),
        status: "waiting"
      };
      $scope.error = "";
      $scope.calculateDashboard();
      $scope.$applyAsync();
      $scope.refresh();
    } catch (err) {
      console.error(err);
      $scope.error = err && err.message ? err.message : "Failed to add token.";
      $scope.$applyAsync();
    }
  };

  $scope.pageTitle = function () {
    const titles = {
      dashboard: "Clinic Dashboard",
      patients: "Patient Records & History",
      tokens: "Token Queue Management",
      labs: "Laboratory Reports",
      medicines: "Medicine Tracking",
      doctors: "Doctor Statistics",
      appointments: "Appointments & Alerts"
    };
    return titles[$scope.page] || "Clinic Dashboard";
  };

  // Today's date in local YYYY-MM-DD format.
  function localDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isToday(value) {
    return String(value || "").slice(0, 10) === localDate();
  }

  function safeFetch(table) {
    if (!db) {
      return Promise.resolve({
        table: table,
        data: demoData[table] || [],
        error: null
      });
    }

    return db.from(table)
      .select("*")
      .order("id", { ascending: false })
      .limit(1000)
      .then(function (result) {
        if (result.error) {
          console.error(table, result.error);
          return { table: table, data: demoData[table] || [], error: result.error.message };
        }
        return { table: table, data: result.data || demoData[table] || [], error: null };
      })
      .catch(function (err) {
        console.error(table, err);
        return { table: table, data: demoData[table] || [], error: err && err.message ? err.message : "Failed to fetch" };
      });
  }

  // Load all modules from Supabase, or fall back to demo data.
  $scope.refresh = async function () {
    $scope.error = "";
    $scope.$applyAsync();

    if (!db) {
      $scope.patients = demoData.patients;
      $scope.doctors = demoData.doctors;
      $scope.appointments = demoData.appointments;
      $scope.tokens = demoData.tokens;
      $scope.consultations = demoData.consultations;
      $scope.prescriptions = demoData.prescriptions;
      $scope.prescriptionItems = demoData.prescription_items;
      $scope.labs = demoData.lab_reports;
      $scope.medicines = demoData.medicines;
      $scope.batches = demoData.medicine_batches;
      $scope.selectedPatient = $scope.patients[0];
      $scope.calculateDashboard();
      $scope.selectPatient($scope.selectedPatient);
      $scope.error = "Supabase is unavailable. Demo data is being shown.";
      $scope.$applyAsync();
      return;
    }

    const tables = [
      "patients",
      "doctors",
      "appointments",
      "tokens",
      "consultations",
      "prescriptions",
      "prescription_items",
      "lab_reports",
      "medicines",
      "medicine_batches"
    ];

    const results = await Promise.all(tables.map(safeFetch));
    const errors = [];
    let hasUsableData = false;

    results.forEach(function (result) {
      const data = result.data || [];
      $scope[result.table] = data;
      if (data.length) {
        hasUsableData = true;
      }
      if (result.error) {
        errors.push(result.table + ": " + result.error);
      }
    });

    if (!hasUsableData && results.length) {
      $scope.patients = demoData.patients;
      $scope.doctors = demoData.doctors;
      $scope.appointments = demoData.appointments;
      $scope.tokens = demoData.tokens;
      $scope.consultations = demoData.consultations;
      $scope.prescriptions = demoData.prescriptions;
      $scope.prescriptionItems = demoData.prescription_items;
      $scope.labs = demoData.lab_reports;
      $scope.medicines = demoData.medicines;
      $scope.batches = demoData.medicine_batches;
      $scope.error = "Supabase is unavailable. Demo data is being shown.";
    }

    $scope.calculateDashboard();

    if (errors.length && !hasUsableData) {
      $scope.error = "Supabase is unavailable. Demo data is being shown.";
    }

    $scope.$applyAsync();
  };

  // Dashboard calculations.
  $scope.calculateDashboard = function () {

    $scope.todayAppointments = $scope.appointments.filter(function (a) {
      return isToday(a.appointment_date) &&
        a.status !== "cancelled";
    });

    $scope.todayTokens = $scope.tokens.filter(function (t) {
      return isToday(t.token_date);
    });

    $scope.waitingTokens = $scope.todayTokens.filter(function (t) {
      return t.status === "waiting";
    });

    $scope.inProgressTokens = $scope.todayTokens.filter(function (t) {
      return t.status === "in_progress";
    });

    $scope.completedTokens = $scope.todayTokens.filter(function (t) {
      return t.status === "completed";
    });

    $scope.remainingTokens = $scope.todayTokens.filter(function (t) {
      return t.status !== "completed" && t.status !== "cancelled";
    }).length;

    $scope.availableDoctors = $scope.doctors.filter(function (d) {
      return d.is_available !== false;
    }).length;

    $scope.upcomingAppointments = $scope.appointments.filter(function (a) {
      return a.appointment_date >= localDate() &&
        a.status !== "cancelled" &&
        a.status !== "completed";
    }).sort(function (a, b) {
      return (a.appointment_date + a.appointment_time)
        .localeCompare(b.appointment_date + b.appointment_time);
    });

    $scope.doctorStats = $scope.doctors.map(function (doctor) {
      const doctorAppointments = $scope.appointments.filter(function (a) {
        return Number(a.doctor_id) === Number(doctor.id);
      });

      const doctorTokens = $scope.todayTokens.filter(function (t) {
        return Number(t.doctor_id) === Number(doctor.id);
      });

      const patientIds = new Set(
        doctorAppointments.map(function (a) {
          return a.patient_id;
        })
      );

      return {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization || "Not specified",
        patients: patientIds.size,
        appointments: doctorAppointments.length,
        completed: doctorAppointments.filter(function (a) {
          return a.status === "completed";
        }).length,
        waiting: doctorTokens.filter(function (t) {
          return t.status === "waiting";
        }).length
      };
    });
  };

  // Get patient name using patient ID.
  $scope.patientName = function (id) {
    const patient = $scope.patients.find(function (p) {
      return Number(p.id) === Number(id);
    });
    return patient ? patient.name : "Unknown patient";
  };

  // Get doctor name using doctor ID.
  $scope.doctorName = function (id) {
    const doctor = $scope.doctors.find(function (d) {
      return Number(d.id) === Number(id);
    });
    return doctor ? doctor.name : "Unknown doctor";
  };

  // Patient history.
  $scope.selectPatient = function (patient) {
    $scope.selectedPatient = patient;

    $scope.patientAppointments = $scope.appointments.filter(function (a) {
      return Number(a.patient_id) === Number(patient.id);
    });

    $scope.patientConsultations = $scope.consultations.filter(function (c) {
      return Number(c.patient_id) === Number(patient.id);
    });

    $scope.patientPrescriptions = $scope.prescriptions.filter(function (p) {
      return Number(p.patient_id) === Number(patient.id);
    });

    $scope.patientLabs = $scope.labs.filter(function (l) {
      return Number(l.patient_id) === Number(patient.id);
    });

    $scope.$applyAsync();
  };

  // Token queue calculations.
  $scope.patientsAhead = function (token) {
    return $scope.todayTokens.filter(function (t) {
      return Number(t.doctor_id) === Number(token.doctor_id) &&
        Number(t.token_number) < Number(token.token_number) &&
        t.status === "waiting";
    }).length;
  };

  $scope.waitMinutes = function (token) {
    if (token.status === "completed" || token.status === "cancelled") {
      return 0;
    }

    if (token.status === "in_progress") {
      return 0;
    }

    return $scope.patientsAhead(token) * AVG_CONSULTATION_MINUTES;
  };

  // Medicine information.
  $scope.medicineName = function (id) {
    const medicine = $scope.medicines.find(function (m) {
      return Number(m.id) === Number(id);
    });
    return medicine ? medicine.name : "Unknown medicine";
  };

  $scope.isExpired = function (date) {
    if (!date) return false;
    return date < localDate();
  };

  // Appointment alert label.
  $scope.appointmentAlert = function (appointment) {
    if (appointment.status === "cancelled") return "Cancelled";
    if (appointment.status === "completed") return "Completed";

    if (appointment.appointment_date < localDate()) {
      return "Past appointment";
    }

    if (appointment.appointment_date === localDate()) {
      return "Today's appointment";
    }

    return "Upcoming appointment";
  };

  // Initial data load.
  $scope.refresh();

});


