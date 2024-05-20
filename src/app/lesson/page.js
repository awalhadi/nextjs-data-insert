'use client';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [textareaValue, setTextareaValue] = useState('');
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);

  const generateSlug = (text) => {
    let slug = text.toLowerCase();
    // Remove any character that is not a letter, number, or space
    slug = slug.replace(/[^a-zA-Z0-9ঀ-৿০-৯\u00C0-\u024F\u1E00-\u1EFF\s]/g, '');
    slug = slug.replace(/\s+/g, '-');
    return slug;
  };

  const handleChangeCourse = (e) => {
    const value = e.target.value;
    const slug = generateSlug(value);
    setCourse({ ...course, title: value, slug: slug });
  };

  const filterTextItems = (items, text) =>
    items.filter((item) => !item.includes(text));

  const removeDigitItems = (items) =>
    items.filter((item) => !/^\d+$/.test(item));
  function parseLessonText(text) {
    const lines = text.split('\n').filter((line) => line.trim() !== '');

    let modifyArray = filterTextItems(lines, 'topics completed');
    modifyArray = filterTextItems(modifyArray, 'পছন্দের চ্যাপ্টার');
    const lessons = removeDigitItems(modifyArray);
    return lessons;
  }
  const parseTextareaInput = () => {
    let lessons = parseLessonText(textareaValue);
    lessons = lessons.map((lesson) => {
      return {
        title: lesson,
        slug: generateSlug(lesson),
      };
    });
    setLessons(lessons);
    // console.log('newQuestion:', newQuestion);
  };

  const handleFocus = (e) => {
    // Your logic when the input is focused
    // For example, you can copy the text
    e.target.select(); // Selects the text in the input when focused
    document.execCommand('copy'); // Copies the selected text
  };

  const handleOptionChange = (e) => {
    // changes
  };

  const storeLessonHandler = () => {
    const url = 'https://admin.mentorslearning.com/api/v1/create-lesson';
    axios.post(url, { lessons: lessons, course: course }).then((res) => {
      console.log('res:', res);
      if (res.data.status === true) {
        setLessons([]);
        setTextareaValue('');
      }
    });
  };

  useEffect(() => {
    if (textareaValue) {
      parseTextareaInput();
    }
  }, [textareaValue]);

  return (
    <>
      <h3>Lesson add section</h3>
      <div>
        <label htmlFor="course">Course</label>
        <input
          type="text"
          id="course"
          name="course"
          value={course?.title}
          onChange={handleChangeCourse}
        />
      </div>

      <p>Input your text area</p>
      <div>
        <p>Paste your question and options here (each on a new line)</p>
        <textarea
          value={textareaValue}
          onChange={(event) => setTextareaValue(event?.target?.value)}
          placeholder="Paste question and options here"
          rows={10}
          cols={50}
        />
      </div>

      <div>
        <p>Lessons</p>
        {lessons && lessons?.length > 0 && course?.title && (
          <button
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={storeLessonHandler}
          >
            Save
          </button>
        )}
        <ul>
          {lessons?.map((lesson, index) => (
            <li key={index}>
              {index + 1}.{' '}
              <input
                type="text"
                value={lesson?.title.trim()}
                readOnly
                onFocus={handleFocus}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
