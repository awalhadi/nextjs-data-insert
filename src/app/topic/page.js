'use client';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [textareaValue, setTextareaValue] = useState('');
  const [course, setCourse] = useState({});
  const [lesson, setLesson] = useState([]);
  const [has_quiz, setHasQuiz] = useState(true);
  const [topics, setTopics] = useState([]);

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
  const handleChangeLesson = (e) => {
    const value = e.target.value;
    const slug = generateSlug(value);
    setLesson({ ...lesson, title: value, slug: slug });
  };

  const filterTextItems = (items, text) =>
    items.filter((item) => !item.includes(text));

  const removeDigitItems = (items) =>
    items.filter((item) => !/^\d+$/.test(item));
  function parseLessonText(text) {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    // console.log('lines:', lines);

    let modifyArray = filterTextItems(lines, 'পছন্দের টপিক');
    const topics = removeDigitItems(modifyArray);
    return topics;
  }
  const parseTextareaInput = () => {
    let topics = parseLessonText(textareaValue);
    topics = topics.map((topic) => {
      return {
        title: topic,
        slug: generateSlug(topic),
      };
    });
    setTopics(topics);
  };

  const handleFocus = (e) => {
    // Your logic when the input is focused
    // For example, you can copy the text
    e.target.select(); // Selects the text in the input when focused
    document.execCommand('copy'); // Copies the selected text
  };

  const handleChangeStatus = (e) => {
    // changes
    const { value, checked } = e.target;
    setHasQuiz(checked);
  };

  const storeLessonHandler = () => {
    const url = 'https://admin.mentorslearning.com/api/v1/create-topic';
    axios
      .post(url, { lesson: lesson, course: course, topics: topics })
      .then((res) => {
        console.log('res:', res);
        setTopics([]);
      });
  };

  useEffect(() => {
    if (textareaValue) {
      parseTextareaInput();
    }
  }, [textareaValue]);

  return (
    <>
      <h3>Topic add section</h3>
      {/* <div>
        <label htmlFor="course">Course</label>
        <input
          type="text"
          id="course"
          name="course"
          value={course?.title}
          onChange={handleChangeCourse}
        />
      </div> */}
      <div>
        <label htmlFor="lesson">Lesson</label>
        <input
          type="text"
          id="lesson"
          name="lesson"
          value={lesson?.title}
          onChange={handleChangeLesson}
        />
      </div>
      <div>
        <label htmlFor="lesson">Has quiz</label>
        <input
          type="checkbox"
          id="has_quiz"
          name="has_quiz"
          value={has_quiz}
          onChange={handleChangeStatus}
          checked
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
        <p>topics</p>
        {topics && topics?.length > 0 && lesson?.title && (
          <button
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={storeLessonHandler}
          >
            Save
          </button>
        )}
        <ul>
          {topics?.map((topic, index) => (
            <li key={index}>
              {index + 1}.{' '}
              <input
                type="text"
                value={topic?.title.trim()}
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
