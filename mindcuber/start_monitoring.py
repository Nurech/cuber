import time

from data.HubMonitor import HubMonitor
from comm.HubClient import HubClient, ConnectionState

connection = 0


class Main:
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
        if Main.hm.execution_status[1]:
            print('Main program running')


def send_cube_map_to_backend(map):
    # TODO
    print(map)


while True:
    send_heartbeat_to_backend(connection)
    time.sleep(1)
    if Main.hm.connection_state == ConnectionState.TELEMETRY:
        if connection == 0:
            connection = 1
        elif connection == 1:
            Main.client.program_execute(1)
            connection = 2
    else:
        print('waiting...')
