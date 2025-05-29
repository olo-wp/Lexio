from openai import OpenAI
import os
from dotenv import load_dotenv
from functionCalling.systemPrompts import *
from functionCalling.functions import *

from pathlib import Path

dotenv_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

client = OpenAI()

def get_response(text: str, model: str = "gpt-4.1", system_prompt: str = SYSTEM_PROMPT, function = FUNCTION ):

    return client.responses.create(
  model=model,
  input=[
    {
      "role": "system",
      "content": [
        {
          "type": "input_text",
          "text": system_prompt
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": text
        }
      ]
    }
  ],
  text={
    "format": {
      "type": "text"
    }
  },
  reasoning={},
  tools=[
      FUNCTION
  ],
  temperature=1,
  max_output_tokens=2048,
  top_p=1,
  store=True
)

