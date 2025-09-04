from fastapi import FastAPI,Request
from pydantic import BaseModel

app=FastAPI()


@app.post("/twilio-webhook")
async def twilio_webhook(request: Request):
    form = await request.form()
    from_number = form.get("From")
    to_number = form.get("To")
    body = form.get("Body")
    
    print(f"Message from {from_number} to {to_number}: {body}")
    
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