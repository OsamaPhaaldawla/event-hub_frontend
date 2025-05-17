import { useRef, useState } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router";
import Step1 from "../components/Form/Step1";
import FormProgress from "../components/Form/FormProgress";
import Step2 from "../components/Form/Step2";
import Step3 from "../components/Form/Step3";
import { useAuth } from "../context/AuthContext";

export default function Host({ edit }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formDataState, setFormDataState] = useState({});

  let data = useLoaderData();
  let event = data.eventData;

  const submit = useSubmit();
  const navigate = useNavigate();
  const { user } = useAuth();
  const form = useRef();

  // Check if the user is admin or own the event else redirect him to login
  if (edit) {
    if (!user) {
      navigate("/login");
    } else if (user.userId !== event.hoster.id && user.role !== "admin") {
      return (
        <p className="text-center mt-4 text-2xl text-red-500">
          You are not Autherized to edit this event
        </p>
      );
    }
  }

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const handleBookClick = () => {
    const formData = new FormData(form.current);
    formData.append("faqs", JSON.stringify(formDataState.faqs));
    formData.append("tags", JSON.stringify(formDataState.tags));
    const amountInCents = +formDataState.price * 100;
    const data = Object.fromEntries(formData.entries());
    navigate("/host-payment", {
      state: {
        amount: amountInCents,
        id: formDataState.venueId,
        mode: "venue",
        formData: data,
      },
    });
  };

  const handleSubmit = () => {
    const formData = new FormData(form.current);
    formData.append("faqs", JSON.stringify(formDataState.faqs));
    formData.append("tags", JSON.stringify(formDataState.tags));
    submit(formData, {
      method: edit ? "PUT" : "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-between gap-x-4 min-h-[600px] mb-4 bg-gray-100">
          <div className="flex w-1/3 justify-center items-center bg-black text-white rounded-r-4xl">
            <FormProgress activeStep={activeStep} />
          </div>
          <div className="mt-12 w-2/3 px-4">
            <Form
              ref={form}
              encType="multipart/form-data"
              method={edit ? "PUT" : "POST"}
              className="max-w-[92%] mx-auto"
            >
              <div className={activeStep === 1 ? "block" : "hidden"}>
                <Step1
                  oldData={edit && event}
                  next={nextStep}
                  edit={edit}
                  setFormDataState={setFormDataState}
                />
              </div>

              <div className={activeStep === 2 ? "block" : "hidden"}>
                <Step2
                  next={nextStep}
                  prev={prevStep}
                  oldData={edit && event}
                  edit={edit}
                  setFormDataState={setFormDataState}
                />
              </div>

              <div className={activeStep === 3 ? "block" : "hidden"}>
                <Step3
                  oldData={edit && event}
                  prev={prevStep}
                  handleSubmit={handleSubmit}
                  formRef={form}
                  formDataState={formDataState}
                  edit={edit}
                  handleBookClick={handleBookClick}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export const editDataLoader = async ({ params }) => {
  const resEvents = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const resVenues = await fetch("http://localhost:3000/venues");

  if (!resEvents.ok) {
    throw { message: "Could not fetch event details." };
  } else if (!resVenues.ok) {
    throw {
      message: "Failed to fetch available venues.",
    };
  } else {
    const eventData = await resEvents.json();
    const venuesData = await resVenues.json();
    return { eventData, venuesData };
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  console.log(formData);
  console.log(formData.getAll("faqs"));
  console.log(formData.getAll("tags"));

  // Collect the images from the form
  let images = formData.getAll("images");

  // Reconstruct FormData with proper file handling
  let fetchFormData = new FormData();

  formData.forEach((value, key) => {
    // Exclude the 'images' field, as we're handling it separately
    if (key !== "images") {
      fetchFormData.append(key, value);
    }
  });

  // Append the images array (can be handled as multiple files)
  images.forEach((image) => {
    fetchFormData.append("images", image);
  });

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId || ""}`,
      {
        method: request.method,
        body: fetchFormData,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to submit");
    return redirect("/events");
  } catch (error) {
    console.error("Submission error:", error);
    throw { error: error.message, status: 500 };
  }
};
