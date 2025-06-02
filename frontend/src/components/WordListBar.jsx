import {useState, useEffect} from 'react'
import api from '../auth/api';

const WordListBar = () => {
    const [WordLists, setWordLists] = useState([]);
    const [Error, setError] = useState(null);

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
            const response = await api.get('/api/user/wordlist/delete/' + id + '/');
            if (response.status === 200 || response.status === 204) {
                setWordLists(WordLists.filter(wordlist => wordlist.id !== id))
            }
        } catch(err) {
            console.log("DELETE ERROR:", err);
        }
    }

    async function addWordList(wordlist) {

    }
}