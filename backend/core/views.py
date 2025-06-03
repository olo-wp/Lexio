from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json



# EXAMPLE VIEW
@csrf_exempt  # This allows POST requests from your frontend (remove in production with proper CSRF handling)
def process_text(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            text = data.get('text', '')

            # Perform your calculations here
            # Example: count words and characters
            word_count = len(text.split())
            char_count = len(text)

            # Prepare response data
            response_data = {
                'original_text': text,
                'word_count': word_count,
                'char_count': char_count,
                # Add any other calculated fields here
            }

            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)