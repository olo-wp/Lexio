import {useEffect, useState} from "react";
import api from "../auth/api.js";
import '../assets/WordSets.css'

const WordSets = () => {
    const [WordLists, setWordLists] = useState([]);
    const [WordListName, setWordListName] = useState("");
    const [words, setWords] = useState([]);
    const [input, setInput] = useState("");
    const [Error, setError] = useState(null);
    const [mode, setMode] = useState(0);
    const [currentID, setCurrentID] = useState(-1);

    useEffect(() => {
        async function fetchWordList() {
            try {
                const response = await api.get('/api/user/wordlist/');
                if (response.status === 200) {
                    setWordLists(response.data);
                }
            }catch(err) {
                console.log(err);
                setError("Error loading your word sets");
            }
        }
        fetchWordList();
    }, [])

    async function delWordList(id) {
        try{
            const response = await api.delete('/api/user/wordlist/' + id + '/');
            if (response.status === 200 || response.status === 204) {
                setWordLists(WordLists.filter(wordlist => wordlist.id !== id))
            }
        } catch(err) {
            console.log("DELETE ERROR:", err);
            setError("Error deleting word set");
        }
    }

    async function addWordList(name, wordlist) {
        try{
            const response = await api.post('api/user/wordlist/', {
                "name": name,
                "words": wordlist
            })
            if (response.status === 201) {
                setWordLists(prev => [...prev, response.data])
                setCurrentID(-1);
            } else if(response.status === 500) {
                setError("Error: Word set with this name already exists");
            } else {
                setError("Error adding your word set");
            }
        } catch (e) {
            console.error("add error:", e);
            setError("Error adding your word set");
        }
    }

    async function modifyWordList() {
        try{
            const response = await api.put('/api/user/wordlist/' + currentID + '/', {
                "id": currentID,
                "name": WordListName,
                "words": words,
            })
            if(response.status === 200 || response.status === 204) {
                setWordLists(prev => prev.filter(wordlist => wordlist.id !== currentID));
                setWordLists(prev => [...prev,
                    {"id": currentID,
                    "name": WordListName,
                    "words": words,}]
                )
            } else {
                setError("Error adding your word set");
            }
        } catch (e) {
            console.error("patch error:", e);
            setError("Error modyfing your word set");
        }
    }

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

    const changeMode = (mode) => {
        setMode(mode);
    }

    const makeChanges = (id, wlist, n_ame) => {
        setMode(2);
        setCurrentID(id);
        setWords(wlist)
        setWordListName(n_ame)
    }


    return(
        <div className="container">
            <div className='wordListsContainer'>
                <ul>
                    {WordLists.map(wordlist => (
                        <li key={wordlist.id} onClick={() => makeChanges(wordlist.id, wordlist.words, wordlist.name)}>
                            <strong>{wordlist.name}</strong>
                            <div className={"wordListRepr"}>
                                {wordlist.words && wordlist.words.length > 0 ? (
                                    <>
                                        {wordlist.words.slice(0, 3).join(', ')}
                                        {wordlist.words.length > 3 ? '...' : ''}
                                    </>
                                ) : (
                                    <em>Brak słów</em>
                                )}
                            </div>
                            <button onClick={() => delWordList(wordlist.id)}>X</button>
                        </li>
                    ))}
                    <li>
                        <button className="wordListRepr" onClick={() => changeMode(1)}> + </button>
                    </li>
                </ul>
            </div>
            {mode > 0 ? (
                <>
                    <div className='wordContainer'>
                        <ul>
                            {words.map(word => (
                                <li key={word}>
                                    {word}
                                    <button onClick={() => removeWord(word)}>X</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <form className="wordForm" onSubmit={(e) => {
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
                    <form className="wordListForm" onSubmit={() => {
                        mode === 1 ? addWordList(WordListName, words) : modifyWordList();
                        setWords([]);
                        setWordListName("");
                    }}>
                        <div className='inputContainer'>
                            <input
                                value={WordListName}
                                onChange={(e) => setWordListName(e.target.value)}
                                type='text'
                                placeholder='Enter word set name'
                                required
                            />
                            <button type="submit" className='button'>
                                Save Set
                            </button>
                        </div>
                        <button onClick={() => changeMode(0)}>
                            Cancel
                        </button>
                    </form>

                </>
            ):(
                <>Add new word sets</>
            )}
        </div>
    )
}

export default WordSets;