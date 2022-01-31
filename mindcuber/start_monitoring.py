import time
import websocket
import asyncio
import rel
import stomper
import threading

from data.HubMonitor import HubMonitor
from comm.HubClient import HubClient, ConnectionState

rel.safe_read()
connection = 0
client = HubClient()
hm = HubMonitor(client)
client.start()
websocket.enableTrace(True)


def on_message(ws, msg):
    frame = stomper.Frame()
    unpacked_msg = stomper.Frame.unpack(frame, msg)
    print("Received the message: " + str(unpacked_msg))


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    ws.send("CONNECT\naccept-version:1.0,1.1,2.0\n\n\x00\n")
    sub = stomper.subscribe("/topic/scan", "MyuniqueId", ack="auto")
    ws.send(sub)


ws = websocket.WebSocketApp("ws://localhost:8080/scan",
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close,
                            header={"token": "robot"})


async def send_message(msg):
    frame = stomper.Frame()
    frame.cmd = "SEND"
    frame.headers = {"token": "robot", "destination": "/app/scan"}
    frame.body = msg
    packed_msg = stomper.Frame.pack(frame)
    print("Sending message: " + str(packed_msg))
    ws.send(packed_msg)


async def main():
    hm.events.console_print += _console_print


def _console_print(msg):
    print(msg)
    substring = "SCANNING"
    if msg.find(substring) != -1:
        print("Found!")
        asyncio.run(send_message(msg))
    else:
        print("Not found!")


async def send_heartbeat_to_backend(connection):
    # TODO
    if connection == 0:
        print('HUB is offline')
    elif connection == 1:
        print('Connection established to HUB')
    elif connection == 2:
        if not hm.execution_status[1]:
            print('Main program started on HUB')
    if hm.execution_status[1]:
        print('Main program running')


def send_cube_map_to_backend(map):
    # TODO
    print(map)


async def start_ws():
    wst = threading.Thread(target=ws.run_forever)
    wst.daemon = True
    wst.start()


asyncio.run(main())

while True:
    asyncio.run(send_heartbeat_to_backend(connection))
    time.sleep(0.1)
    if hm.connection_state == ConnectionState.TELEMETRY:
        if connection == 0:
            connection = 1
        elif connection == 1:
            client.program_execute(1)
            asyncio.run(start_ws())
            time.sleep(5)
            # asyncio.run(send_message('456'))
            connection = 2
    else:
        print('waiting...')
