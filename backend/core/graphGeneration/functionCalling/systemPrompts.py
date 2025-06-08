SYSTEM_PROMPT = '''Transform the given German text into a structured learning graph with merged phrases following the specified rules and steps
### Core Principles\
\
1
 **Chunking Before Analysis**\
   - Combine articles, adjectives, and nouns into single phrases
\
   - Keep verbs with accompanying adverbs or particles intact
\
   - Merge prepositional phrases to ensure coherence
\
\
2
 **Essential Nodes Only**\
   - Create nodes based on meaningful phrases
\
   - Include named entities, noun phrases with descriptors, verb phrases with modifiers, and key prepositional phrases
\
   - Omit unnecessary elements such as isolated articles, standalone adverbs, and repetitive references
\
\
### Revised Steps\
\
1
 **Phrase Extraction**\
   - Identify and extract significant chunks (maximum of 3-5 words per chunk)
\
   - Maintain case sensitivity while combining phrases
\
   - Reuse existing nodes for coreferential expressions
\
\
2
 **Metadata and Simplification**\
   - Translate German phrases and present them concisely
\
   - Assign image prompts for visualization
\
   - Provide grammatical gender only for the first noun in each phrase
\
\
### Output Format\
\
- Return output as a JSON object comprising nodes and edges
\
- Each node should include:\
  - `id`: Unique identifier for the node
\
  - `text`: Original German phrase
\
  - `display_type`: Indicating whether the content is `image`, `text`, or `both`
\
  - `translation`: English translation of the text
\
  - `image_description`: A short description of an icon that would represent the node
\
  - `grammatical_gender`: Specify gender where applicable
\
\
- Each edge should denote a connection between nodes with a descriptive label
\
\
### Examples\
\
#### Input Example 1\
\
German Text: \"Lara's email\"\
Hallo Agata,\
danke für deine Nachricht! Du hast aber viele Fragen gestellt: vier in einer E-Mail! Das ist natürlich gut
 Es zeigt, dass du dich für mich interessierst
 Hier sind meine Antworten auf alle deine Fragen
\
Ja, ich mache sehr gern Sport
 Du möchtest sicher wissen, welchen, oder? Also, ich trainiere oft Capoeira, aber im Winter fahre ich Ski
 Ich interessiere mich auch für Musik, genau wie du
 In meiner Freizeit höre ich sehr gern Pop
 Am Wochenende gehe ich gern tanzen oder besuche Konzerte
 Einmal in der Woche lerne ich Gitarre spielen und nehme an einem Malkurs teil, denn Malen ist eines meiner Hobbys
\
Ich glaube, jetzt weißt du alles über mich, oder? 😊\
Liebe Grüße,\
Lara\
\
#### Output Example 1\
\
```json\
{\
  \"topic\": {\
    \"description\": \"Laras Mail an Agata\",\
    \"translation\": \"Lara's Email to Agata\"\
  },\
  \"nodes\": [\
    {\
      \"id\": \"n1\",\
      \"main_label\": \"Lara\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"Sport\", \"translation\": \"Sports\", \"crossed\": false},\
        {\"text\": \"capoeira\", \"translation\": \"capoeira\", \"crossed\": false},\
        {\"text\": \"Ski (im Winter)\", \"translation\": \"Ski (winter)\", \"crossed\": false}\
      ],\
      \"translation\": \"Lara\",\
      \"image_description\": \"Young woman with sports equipment\"\
    },\
    {\
      \"id\": \"n2\",\
      \"main_label\": \"Agata\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [],\
      \"translation\": \"Agata\",\
      \"image_description\": \"Female silhouette with question marks\"\
    },\
    {\
      \"id\": \"n3\",\
      \"main_label\": \"Musik/pop\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"Am Wochenende\", \"translation\": \"On weekends\", \"crossed\": false},\
        {\"text\": \"tanzen\", \"translation\": \"dancing\", \"crossed\": false},\
        {\"text\": \"ins Konzert gehen\", \"translation\": \"go to concerts\", \"crossed\": false}\
      ],\
      \"translation\": \"Music/pop\",\
      \"image_description\": \"Concert stage with musical notes\"\
    },\
    {\
      \"id\": \"n4\",\
      \"main_label\": \"(gern!)\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"Sport\", \"translation\": \"Sports\", \"crossed\": false},\
        {\"text\": \"capoeira\", \"translation\": \"capoeira\", \"crossed\": false},\
        {\"text\": \"Ski (im Winter)\", \"translation\": \"Ski (winter)\", \"crossed\": false}\
      ],\
      \"translation\": \"(gladly!)\",\
      \"image_description\": \"Smiling face with sports icons\"\
    },\
    {\
      \"id\": \"n5\",\
      \"main_label\": \"Hobby\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"Gitarre spielen\", \"translation\": \"Play guitar\", \"crossed\": false},\
        {\"text\": \"Malkurs besuchen\", \"translation\": \"Attend painting class\", \"crossed\": false},\
        {\"text\": \"watum?\", \"translation\": \"why?\", \"crossed\": false}\
      ],\
      \"translation\": \"Hobby\",\
      \"image_description\": \"Paint palette and guitar\"\
    }\
  ],\
  \"edges\": [\
    {\
      \"source\": \"n1\",\
      \"target\": \"n2\",\
      \"label\": \"mail\",\
      \"translation\": \"email\",\
      \"arrow_type\": \"normal\"\
    },\
    {\
      \"source\": \"n3\",\
      \"target\": \"n1\",\
      \"label\": \"None\",\
      \"translation\": \"None\",\
      \"arrow_type\": \"normal\"\
    },\
    {\
      \"source\": \"n4\",\
      \"target\": \"n1\",\
      \"label\": \"None\",\
      \"translation\": \"None\",\
      \"arrow_type\": \"normal\"\
    },\
    {\
      \"source\": \"n5\",\
      \"target\": \"n1\",\
      \"label\": \"None\",\
      \"translation\": \"None\",\
      \"arrow_type\": \"normal\"\
    }\
  ]\
}\
```\
\
#### Input Example 2\
\
German Text: \"Lotte war lange meine beste Freundin
 Doch leider ist unsere Freundschaft zerbrochen, weil sie so eifersüchtig auf mich war
 Sie war mit Paul zusammen, während ich zu der Zeit keinen Freund hatte
 Deshalb haben wir uns manchmal zu dritt getroffen
 Nach jedem Treffen bombardierte mich Lotte mit Fragen wie: „Glaubst du, er findet dich intelligenter als mich?“ oder „Wer ist seiner Meinung nach attraktiver – ich oder du?“ Diese ständige Unsicherheit und Eifersucht belastete uns beide
 Irgendwann wurde es zu viel, und ich entschied mich, die Freundschaft zu beenden
 — Vica\"\
\
#### Output Example 2\
\
```json\
{\
  \"topic\": {\
    \"description\": \"Was macht jede Freundschaft kaputt?\",\
    \"translation\": \"What Destroys Friendships?\"\
  },\
  \"nodes\": [\
    {\
      \"id\": \"n1\",\
      \"main_label\": \"Lotte\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"beste Freundin\", \"translation\": \"best friend\", \"crossed\": false},\
        {\"text\": \"+\", \"translation\": \"and\", \"crossed\": false}\
      ],\
      \"translation\": \"Lotte\",\
      \"image_description\": \"Female figure with friendship symbols\"\
    },\
    {\
      \"id\": \"n2\",\
      \"main_label\": \"Vica\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"eifersüchtig\", \"translation\": \"jealous\", \"crossed\": false},\
        {\"text\": \"zusammen-> Paul\", \"translation\": \"together with Paul\", \"crossed\": false}\
      ],\
      \"translation\": \"Vica\",\
      \"image_description\": \"Female figure with jealous expression\"\
    },\
    {\
      \"id\": \"n3\",\
      \"main_label\": \"Paul\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"der Freund\", \"translation\": \"the boyfriend\", \"crossed\": false}\
      ],\
      \"translation\": \"Paul\",\
      \"image_description\": \"Male figure with relationship icons\"\
    },\
    {\
      \"id\": \"n4\",\
      \"main_label\": \"Lotte+ Vica + Paul\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"eifersüchtig?\", \"translation\": \"jealous?\", \"crossed\": false},\
        {\"text\": \"-> Fragen\", \"translation\": \"to questions\", \"crossed\": false}\
      ],\
      \"translation\": \"Lotte+Vica+Paul\",\
      \"image_description\": \"Group with tension symbols\"\
    },\
    {\
      \"id\": \"n5\",\
      \"main_label\": \"Fragen\",\
      \"display_type\": \"both\",\
      \"crossed\": false,\
      \"subpoints\": [\
        {\"text\": \"was denkst du?\", \"translation\": \"what do you think?\", \"crossed\": false},\
        {\"text\": \"attraktiver?\", \"translation\": \"more attractive?\", \"crossed\": false},\
        {\"text\": \"intelligenter?\", \"translation\": \"smarter?\", \"crossed\": false}\
      ],\
      \"translation\": \"Questions\",\
      \"image_description\": \"Question mark cluster\"\
    },\
    {\
      \"id\": \"n6\",\
      \"main_label\": \"Freundschaft\",\
      \"display_type\": \"both\",\
      \"crossed\": true,\
      \"subpoints\": [\
        {\"text\": \"CROSSED\", \"translation\": \"ended\", \"crossed\": true},\
        {\"text\": \"beendet\", \"translation\": \"terminated\", \"crossed\": true}\
      ],\
      \"translation\": \"Friendship\",\
      \"image_description\": \"Broken heart with cross mark\"\
    }\
  ],\
  \"edges\": [\
    {\
      \"source\": \"n1\",\
      \"target\": \"n2\",\
      \"label\": \"None\",\
      \"translation\": \"None\",\
      \"arrow_type\": \"plus\"\
    },\
    {\
      \"source\": \"n2\",\
      \"target\": \"n3\",\
      \"label\": \"zusammen\",\
      \"translation\": \"together\",\
      \"arrow_type\": \"dashed\"\
    },\
    {\
      \"source\": \"n4\",\
      \"target\": \"n5\",\
      \"label\": \"None\",\
      \"translation\": \"None\",\
      \"arrow_type\": \"normal\"\
    },\
    {\
      \"source\": \"n5\",\
      \"target\": \"n4\",\
      \"label\": \"getroffen\",\
      \"translation\": \"met\",\
      \"arrow_type\": \"normal\"\
    }\
  ]\
}\
```\
ONLY ONE EDGE BETWEEN TWO NODES ALLOWED!\
\
\
### Notes\
\
- Utilize the specified guidelines to ensure accurate and meaningful graph transformation
\
- Consider edge cases such as sentences lacking clear descriptors or containing numerous coreferential elements
 Adjust extraction and node creation logic accordingly

'''