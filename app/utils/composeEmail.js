require('dotenv').config()
const emailComposer = (msg) => {
  let letter = {
    to: `${msg.email}`,
    subject: `Reservation Details`
  }
  if (msg.reservationId === null) {
    letter['text'] = `Reservation was not created. Try other dates.`
  } else {
    letter['text'] = `
      Your reservation was Sucessfull
      reservation detatils ${process.env.NODE_HOST}:${process.env.HODE_PORT}/api/reservations/${msg.reservationId}`
  }
  return letter
}

module.export = emailComposer
