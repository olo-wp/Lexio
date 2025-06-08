from openai import OpenAI
import os
from dotenv import load_dotenv
import dotenv
from .systemPrompts import *
from .functions import *

load_dotenv()
client = OpenAI()
def get_response(text: str, system_prompt: str = None, function = None, model: str = "gpt-4.1", ):

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
      function
  ],
  temperature=1,
  max_output_tokens=2048,
  top_p=1,
  store=True
)