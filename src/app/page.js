'use client';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [topic, setTopic] = useState({});
  const [quiz_for, setQuizFor] = useState('topic');
  const [quiz_type, setQuizType] = useState('mcq');

  const [quizzes, setQuizzes] = useState([]);
  const [mcq, setMcq] = useState([]);
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState({});
  const [options, setOptions] = useState([]);

  const onChangeText = (event) => {
    const text = event.target.value;
    // replace lojens.com with "winlearner.com"
    const newText = text.replace('lojens.com', 'winlearner.com');
    setImageUrl(newText);
  };

  const downloadImage = () => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const urlObject = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlObject;
        link.download = imageUrl.split('/').pop(); // Extracts filename from URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setImageUrl('');
      })
      .catch((error) => console.error('Error downloading image:', error));
  };

  function parseQuestionText(text) {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    // console.log('lines:', lines);
    const optionKeys = ['A.', 'B.', 'C.', 'D.'];
    let question = lines[0];
    const options = [];
    let correctAnswer = {
      text: '',
      key: '',
    };

    // question no
    const questionNoRegex = /\d/;
    const questionNoindex = lines.findIndex((line) =>
      line.match(questionNoRegex),
    );
    let questionNo = null;
    if (questionNoindex !== -1) {
      questionNo = lines[questionNoindex];
      // console.log('questionNo:', questionNo);
      // questionNo = lines[questionNoindex].replace('.', '');
      question = lines[questionNoindex + 1];
    }
    // console.log('questionNo:', questionNo);

    // Use regex to find the correct answer section
    const correctAnswerRegex = /ANSWER IS/;
    const correctAnswerIndex = lines.findIndex((line) =>
      correctAnswerRegex.test(line),
    );
    if (correctAnswerIndex !== -1) {
      let correctAnswerKey = lines[correctAnswerIndex + 1].trim();
      let correctAnswerText = lines[correctAnswerIndex + 2].trim();

      correctAnswer = { text: correctAnswerText, key: correctAnswerKey };
    }

    optionKeys.forEach((keyVal) => {
      // find index of this keyVal in lines
      const index = lines.findIndex((line) => line.trim().startsWith(keyVal));
      let optionText = lines[index + 1];
      // trim the option text
      optionText = optionText.trim();
      let newOption = {
        key: keyVal,
        text: optionText,
      };
      const optionIndex = options.findIndex((option) => option.key === keyVal);
      if (optionIndex !== -1) {
        options[optionIndex] = newOption;
      } else {
        options.push(newOption);
      }
    });

    return { questionNo, question, options, correctAnswer };
  }
  const parseTextareaInput = () => {
    const newQuestion = parseQuestionText(textareaValue);
    const quizOptions = newQuestion?.options.map((option) => {
      return {
        option_title: option?.text,
        is_correct:
          option?.key == newQuestion?.correctAnswer?.key ? true : false,
      };
    });
    const newQuiz = {
      title: newQuestion?.question,
      type: 'mcq',
      options: quizOptions,
    };
    console.log('newQuiz:', newQuiz);

    // Check if the question already exists in the mcq state
    const questionExists = mcq.some(
      (mcqItem) => mcqItem.question == newQuestion?.question,
    );
    if (!questionExists) {
      setQuizzes((prevQuiz) => [...prevQuiz, newQuiz]);
      setMcq((prevMcq) => [...prevMcq, newQuestion]);
    }

    setQuestion(newQuestion.question);
    setCorrectAnswer(newQuestion.correctAnswer);
    setOptions(newQuestion.options);
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

  const generateSlug = (text) => {
    let slug = text.toLowerCase();
    // Remove any character that is not a letter, number, or space
    slug = slug.replace(/[^a-zA-Z0-9ঀ-৿০-৯\u00C0-\u024F\u1E00-\u1EFF\s]/g, '');
    slug = slug.replace(/\s+/g, '-');
    return slug;
  };

  const handleChangeTopic = (e) => {
    const value = e.target.value;
    const slug = generateSlug(value);
    setTopic({ title: value, slug: slug });
  };
  const handleChangeTopicSlug = (e) => {
    const value = e.target.value;
    setTopic((prevTopic) => ({ ...prevTopic, slug: value }));
  };

  const storeQuizHandler = () => {
    if (quizzes?.length > 0 && topic?.title) {
      const url = 'https://admin.mentorslearning.com/api/v1/create-mcq';
      axios
        .post(url, {
          topic: topic,
          quiz_for: quiz_for,
          quiz_type: quiz_type,
          quizzes: quizzes,
        })
        .then((res) => {
          console.log('res:', res);
          if (res.data.status === true) {
            setQuizzes([]);
            setTextareaValue('');
            setMcq([]);
          }
        });
    }
  };

  useEffect(() => {
    if (textareaValue) {
      parseTextareaInput();
    }
  }, [textareaValue]);

  return (
    <>
      <p>Image download link here</p>
      <input
        type="text"
        onChange={onChangeText}
        value={imageUrl}
        className=""
        placeholder="Image link"
      />

      <p>{imageUrl}</p>
      {imageUrl && (
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={downloadImage}
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download</span>
        </button>
      )}
      {imageUrl && (
        <Image src={imageUrl} alt="image" width={500} height={500} />
      )}
      <h3>Quiz add section</h3>
      <p>Topic name</p>
      {quizzes && quizzes?.length > 0 && topic?.title && (
        <p>
          <button
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={storeQuizHandler}
          >
            Save
          </button>
        </p>
      )}
      <label>Title</label>
      <input
        type="text"
        onChange={handleChangeTopic}
        value={topic?.title}
        className=""
        placeholder="Topic name here"
      />
      <label>Slug</label>
      <input
        type="text"
        onChange={handleChangeTopicSlug}
        value={topic?.slug}
        className=""
        placeholder="Topic slug"
      />

      <div>
        <p>Paste your question and options here (each on a new line)</p>
        <textarea
          value={textareaValue}
          onChange={(event) => setTextareaValue(event?.target?.value)}
          placeholder="Paste question and options here"
          rows={10}
          cols={50}
        />
        {mcq &&
          mcq?.length > 0 &&
          mcq.map((mcqItem, index) => (
            <div className="m-6 grid grid-cols-2 gap-1" key={index}>
              <div className="p-4">
                {mcqItem?.questionNo && (
                  <h6>Question No: {mcqItem?.questionNo}</h6>
                )}
                <p>
                  <input
                    type="text"
                    className="w-full"
                    value={mcqItem?.question}
                    onChange={handleOptionChange}
                    onFocus={handleFocus}
                  />
                </p>
                <ul>
                  {mcqItem?.options.map((option, optionIndex) => (
                    <li key={`option-${optionIndex}`}>
                      <p>
                        {/* focus on copy input text */}
                        <input
                          type="text"
                          className="w-full"
                          onChange={handleOptionChange}
                          value={option?.text}
                          onFocus={handleFocus}
                        />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {mcqItem?.correctAnswer?.key && (
                  <>
                    <h6>Correct answer:</h6>
                    <p>
                      {mcqItem?.correctAnswer?.key}
                      {mcqItem?.correctAnswer?.text}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
