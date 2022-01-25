import time
import websocket
import _thread
import rel

from data.HubMonitor import HubMonitor
from comm.HubClient import HubClient, ConnectionState

connection = 0

rel.safe_read()


def on_message(ws, message):
    print(message)


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    print("Opened connection")


class Main:

    if __name__ == "__main__":
        websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8080/lobby",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()

    client = HubClient()
    hm = HubMonitor(client)

    def __init__(self):
        self.hm.events.console_print += self._console_print
        self.client.start()

    def _console_print(self, msg):
        print(msg)


Main()


def send_heartbeat_to_backend(connection):
    # TODO
    if connection == 0:
        print('HUB is offline')
    elif connection == 1:
        print('Connection established to HUB')
    elif connection == 2:
        if not Main.hm.execution_status[1]:
            print('Main program started on HUB')
        # if Main.hm.execution_status[1]:
    # print('Main program running')


def send_cube_map_to_backend(map):
    # TODO
    print(map)


while True:
    send_heartbeat_to_backend(connection)
    time.sleep(0.1)
    if Main.hm.connection_state == ConnectionState.TELEMETRY:
        if connection == 0:
            connection = 1
        elif connection == 1:
            Main.client.program_execute(1)
            connection = 2
    else:
        print('waiting...')
