// import { useState, useEffect } from "react";
// import { Field, useFormikContext } from "formik";
// import { useSearchTagsByNameQuery } from "../../redux/api/tagApiSlices";

// const TagField = () => {
//   const { values, setFieldValue, handleChange, handleBlur } = useFormikContext();
//   const [inputValue, setInputValue] = useState("");
//   const { data: tags } = useSearchTagsByNameQuery(inputValue);

//   useEffect(() => {
//     if (values.tags !== inputValue) {
//       setInputValue(values.tags);
//     }
//   }, [values.tags]);

//   const handleTagClick = (tag) => {
//     setFieldValue("tags", tag);
//   };

//   return <div>TagField</div>;
// };
// export default TagField;
