const { SerialPort } = require('serialport')

let arduinoPort = null;

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

async function listSerialPorts() {
	if(arduinoPort != null) return

	await SerialPort.list().then((ports, err) => {
		if(err) {
			console.error(err.message)
			return
		}

		console.log('ports', ports)

		for(let i=0; i<ports.length; i++){
			if(ports[i].manufacturer.includes('Arduino')){
				console.log(`Arduino detected on port ${ports[i].path}`)
				arduinoPort = new SerialPort({
					path: ports[i].path,
					baudRate: 9600,
				})
			}
		}
	})
}

let checkSerialPort = setInterval( listSerialPorts, 2000)