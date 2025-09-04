from fastapi import FastAPI
from pydantic import BaseModel

app=FastAPI()

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