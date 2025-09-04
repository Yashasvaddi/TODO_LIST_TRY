from fastapi import FastAPI,Request
from pydantic import BaseModel
import _asyncio
import google.generativeai as genai
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()
genai.api_key = os.getenv('gemini_api_key')  # assign API key

genai.configure()  # no arguments

model = genai.GenerativeModel('gemini-2.0-flash')

app=FastAPI()


@app.post("/twilio-webhook")
async def twilio_webhook(request: Request):
    form = await request.form()
    from_number = form.get("From")
    to_number = form.get("To")
    body = form.get("Body")
    
    print(f"Message from {from_number} to {to_number}: {body}")
    ans=model.generate_content(f"Give an appropriate response to Panda")

    account_sid = os.getenv('account_sid')
    auth_token = os.getenv('auth_token')
    client = Client(account_sid, auth_token)

    message = client.messages.create(
    from_='whatsapp:+14155238886',
    body=f'{ans.text}',
    to='whatsapp:+919326240918'
)


    # Optionally send back a response to Twilio
    return {"status": "received", "body": body}


@app.post('/notjsontest')
def tester(value):
    print(value)
    return value

class value(BaseModel):
    text:str

@app.post('/test')
def test(payload:value):
    print(payload.text)
    return payload.text