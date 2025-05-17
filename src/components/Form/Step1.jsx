import { useState } from "react";
import { eventTypes } from "../../constants";
import Input from "./Input";
import SelectInput from "./SelectInput";
import { validateStep1 } from "./Validatioin";
import ImageUploader from "../ImageUploader";
import { IoCloseSharp } from "react-icons/io5";

export default function Step1({
  next,
  oldData,
  edit = false,
  setFormDataState,
}) {
  const [accessType, setAccessType] = useState(
    edit ? oldData.accessType : null
  );
  const [errors, setErrors] = useState({});
  const [faqs, setFaqs] = useState(
    edit
      ? typeof oldData.faqs === "string"
        ? JSON.parse(oldData.faqs)
        : oldData.faqs
      : [{ question: "", answer: "" }]
  );
  const [tags, setTags] = useState(
    edit
      ? typeof oldData.tags === "string"
        ? JSON.parse(oldData.tags)
        : oldData.tags
      : []
  );

  function handleClick() {
    const fd = new FormData(document.querySelector("form"));
    const data = Object.fromEntries(fd.entries());
    fd.append("tags", JSON.stringify(tags));
    fd.append("faqs", JSON.stringify(faqs));

    if (tags.length > 0) {
      setFormDataState((oldState) => ({ ...oldState, tags }));
    }

    if (faqs.length > 0 && faqs[0].question !== "") {
      setFormDataState((oldState) => ({ ...oldState, faqs }));
    }

    if (edit && data.images.length === 0) delete data.images;

    const { validationErrors } = validateStep1(data);
    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      next();
    }
  }

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const handleFaqRemove = (index) => {
    setFaqs((oldFaqs) => {
      const updated = [...oldFaqs];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleTagChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  return (
    <div className="mb-12 max-h-[700px] overflow-y-scroll p-2">
      <h2 className="text-xl mb-2 font-bold">Event Information:</h2>
      <p className="text-gray-600 mb-4">Required fields *</p>
      <Input
        name="title"
        label="Event Title"
        type="text"
        required
        error={errors.title}
        defaultValue={edit ? oldData.title : ""}
      />
      <Input
        name="subtitle"
        label="Event Subtitle"
        type="text"
        error={errors.subtitle}
        defaultValue={edit ? oldData.subtitle : ""}
      />
      <div className="flex justify-between gap-4">
        <div className="w-1/2 mb-3">
          <SelectInput
            label="Event Type *"
            options={eventTypes}
            placeHolder="Your Event Type"
            name="type"
            error={errors.type}
            defaultValue={edit ? oldData.type : ""}
          />
        </div>
        <div className="w-1/2 mb-3">
          <SelectInput
            label="Access Type *"
            options={["open", "free-limited", "paid"]}
            placeHolder="Accessablity"
            onChange={(e) => setAccessType(e.target.value)}
            name="accessType"
            error={errors.accessType}
            defaultValue={edit ? oldData.accessType : ""}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        {(accessType === "free-limited" || accessType === "paid") && (
          <div className="w-1/2">
            <Input
              type="number"
              name="seats"
              label="Seats Avaialble"
              required
              className="w-1/2"
              placeholder="0"
              error={errors.seats}
              defaultValue={edit ? oldData.seats : ""}
            />
          </div>
        )}
        {accessType === "paid" && (
          <div className="w-1/2">
            <Input
              type="number"
              name="price"
              label="Ticket Price"
              required
              className="w-1/2"
              placeholder="0"
              error={errors.price}
              defaultValue={edit ? oldData.price : ""}
            />
          </div>
        )}
      </div>
      <div className="w-fit">
        <ImageUploader
          setFormDataState={setFormDataState}
          images={edit ? oldData.images : null}
          eventUploader
        />
      </div>
      <div>
        <Input
          as="textarea"
          name="description"
          label="Event Description"
          required
          className="resize-none"
          rows="3"
          error={errors.description}
          defaultValue={edit ? oldData.description : ""}
        />
        <Input
          type="text"
          label="Tags:"
          placeholder="Enter tags, separated by commas"
          onChange={handleTagChange}
          className="input"
          defaultValue={tags}
        />
        <h3 className="text-lg">FAQs:</h3>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-2 bg-gray-200/30 p-2 rounded-lg flex items-start gap-x-6"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Question"
                value={faq.question}
                onChange={(e) =>
                  handleFaqChange(index, "question", e.target.value)
                }
                className="input"
              />
              <Input
                as="textarea"
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) =>
                  handleFaqChange(index, "answer", e.target.value)
                }
                className="mt-2"
              />
            </div>
            <button type="button">
              <IoCloseSharp
                className="w-4 mt-2 mr-3 scale-150 text-red-600 cursor-pointer"
                onClick={() => handleFaqRemove(index)}
              />
            </button>
          </div>
        ))}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={addFaq}
            className="btn mt-2 cursor-pointer"
          >
            Add FAQ
          </button>
        </div>
      </div>
      <div className="mt-8 mb-3">
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
