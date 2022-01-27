import time
import websocket
import asyncio
import rel

from data.HubMonitor import HubMonitor
from comm.HubClient import HubClient, ConnectionState

rel.safe_read()
connection = 0
client = HubClient()
hm = HubMonitor(client)
client.start()


def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    print("Opened connection")


async def main():
    hm.events.console_print += _console_print


def _console_print(msg):
    print(msg)


def send_heartbeat_to_backend(connection):
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
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8080/lobby",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()


def start_client():
    asyncio.run(start_ws())
    print("Finished")


while True:
    send_heartbeat_to_backend(connection)
    time.sleep(0.1)
    if hm.connection_state == ConnectionState.TELEMETRY:
        if connection == 0:
            connection = 1
        elif connection == 1:
            client.program_execute(1)
            asyncio.run(main())
            start_client()
            connection = 2
    else:
        print('waiting...')
