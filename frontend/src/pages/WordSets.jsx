import {useState} from "react";

const WordSets = () => {
    const [words, setWords] = useState([]);
    const [input, setInput] = useState("");

    const addWord = (e) => {
        e.preventDefault();
        const word = input.trim();
        if(!words.includes(word)){
            setWords(words => [...words, word]);
        }
        setInput("");
    }

    const removeWord = (wordToRemove) => {
        setWords(prevWords => prevWords.filter(word => word !== wordToRemove));
    };


    return(
        <div>
            <div className='wordContainer'>
                <ul>
                    {words.map(word => (
                        <li key={word}>
                            {word}<button onClick={() => removeWord(word)}>X</button>
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={(e) => {
                addWord(e);
            }}>
                <div className='inputContainer'>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Enter a word'
                        required
                    />
                    <button type="submit" className="button">
                        Add word
                    </button>
                </div>
            </form>
            <div className='saveBox'>
                <button type="submit" className='button' onClick={() => {}}>
                       save set
                </button>
            </div>
        </div>
    )
}

export default WordSets;