import { useState } from 'react';
import '../components/AuthForm.css'

function TextProcessor() {
  const [language, setLanguage] = useState('german');
  const [level, setLevel] = useState('A2');
  const [words, setWords] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);




    //----------------------------
    // TUTAJ ROBISZ CALL:

    const payload = {
      language, // optional, default ustawilem na german
      level,
      words: words.split(',').map((w) => w.trim()).filter(Boolean),
    };

    try {
      const response = await fetch('http://localhost:8080/api/generate-text/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });



    //----------------------------

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"form-container"}>
      <form className={"form"} onSubmit={handleSubmit}>
          <div className={"form-group"}>
              <div>
                  <label>Language:</label>
                  <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="e.g. german"
                  />
              </div>
              <div>
                  <label>Level:</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}>
                      <option value="A1">A1</option>
                      <option value="A2" selected>A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                  </select>
              </div>
              <div>
                  <label>Words (comma-separated):</label>
                  <input
                      type="text"
                      value={words}
                      onChange={(e) => setWords(e.target.value)}
                      placeholder="e.g. Hund, spielen, Baum, laufen"
                  />
              </div>
          </div>
          <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Process wordset'}
          </button>
      </form>
          {result && (
            <div className={"resultsContainer"}>
                <h3>Results:</h3>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
        )}

    </div>
  );
}

export default TextProcessor;
