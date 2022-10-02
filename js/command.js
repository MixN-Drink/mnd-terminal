const { SerialPort } = require('serialport')

let arduinoPort = null
let modalMsg = null

document.addEventListener('DOMContentLoaded', function() {
	modalMsg = M.Modal.init(document.getElementById('modal-msg'), {dismissible: false})
})

document.getElementById('send0').addEventListener('click', () => {
	const surtidor = document.getElementById('subcmd0').value
	const porcentaje = document.getElementById('data0').value

	const status = 0b10000000 | parseInt(surtidor) << 4
	const data = parseInt(porcentaje)

	console.log(`Comando: Surtir\nSurtidor: ${surtidor}\nPorcentaje: ${porcentaje}`)
	console.log(`Status: ${status.toString(2)} Data: ${data.toString(2)}`)

	arduinoPort.write(Buffer.from([status,data]))
})
document.getElementById('send1').addEventListener('click', () => {
	const estado = document.getElementById('data1').checked? 1 : 0

	const status = 0b10001111
	const data = estado

	console.log(`Comando: Prender/apagar LED\nEstado: ${estado}`)
	console.log(`Status: ${status.toString(2)} Data: ${data.toString(2)}`)

	arduinoPort.write(Buffer.from([status,data]))
})

const arduinoDisconnected = () => {
	modalMsg.open()
	const msg = document.getElementById('message')
	msg.innerHTML = "Arduino desconectado"
	msg.classList.remove('hide')
}
const arduinoConnected = () => {
	modalMsg.close()
	const msg = document.getElementById('message')
	msg.classList.add('hide')
	M.toast({html: `Arduino conectado en el puerto ${arduinoPort.path}`})
}
const arduinoFailedToOpen = () => {
	arduinoDisconnected()
	M.toast({html: `No se pudo conectar al puerto ${arduinoPort.path}. Compruebe que el puerto no esté en uso.`})
}

async function listSerialPorts() {
	await SerialPort.list().then((ports, err) => {
		if(err) {
			console.error(err.message)
			return
		}

		for(let i=0; i<ports.length; i++){
			if(arduinoPort !== null && ports[i].path === arduinoPort.path) return

			if(ports[i].manufacturer.includes('Arduino') && arduinoPort === null){
				arduinoPort = new SerialPort({
					path: ports[i].path,
					baudRate: 9600,
				})

				setTimeout(() => {
					if(arduinoPort.isOpen){
						arduinoConnected()
					} else {
						arduinoFailedToOpen()
					}
				}, 1000)

				arduinoPort.on('readable', () => {
					console.log(arduinoPort.read().toString())
				})

				return
			}
		}

		arduinoPort = null
		arduinoDisconnected()
	})
}

let checkSerialPort = setInterval(listSerialPorts, 1000)