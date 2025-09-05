from fastapi import FastAPI,Request, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import _asyncio
import google.generativeai as genai
from twilio.rest import Client
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*",  # or specify allowed frontend URLs
]

load_dotenv()

gemini_api_key=os.getenv('gemini_api_key')

genai.configure(api_key = gemini_api_key)

model = genai.GenerativeModel('gemini-2.0-flash')

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
groups={
    "group1":set(),
    "group2":set(),
    "group3":set(),
    "group4":set(),    
}

@app.websocket("/ws/{group_name}")
async def websocket_endpoint(websocket: WebSocket,group_name:str):
    await websocket.accept()
    groups[group_name].add(websocket)
    print(f"New user connected to {group_name}. Total users: {len(groups[group_name])}")
    
    try:
        while True:
            message = await websocket.receive_text()
            print(f"{group_name} is Received: {message}")
            for user in groups[group_name]:
                if user != websocket:
                    try:
                        await user.send_text(f"{group_name}{message}")
                    except:
                        pass
    except WebSocketDisconnect:
        print(f"User disconnected from {group_name}")
    finally:
        groups[group_name].remove(websocket)
        print(f"Total users: {len(groups[group_name])}")


@app.post("/twilio-webhook")
async def twilio_webhook(request: Request):
    form = await request.form()
    from_number = form.get("From")
    to_number = form.get("To")
    body = form.get("Body")
    
    print(f"Message from {from_number} to {to_number}: {body}")
    ans=model.generate_content(f"Give an appropriate response to {body}. Answer in  only one line.")

    account_sid = os.getenv('account_sid')
    auth_token = os.getenv('auth_token')
    client = Client(account_sid, auth_token)

    message = client.messages.create(
    from_='whatsapp:+14155238886',
    body=f'{ans.text}',
    to='whatsapp:+919702120202'
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