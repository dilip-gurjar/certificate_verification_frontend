// export const DATA_EVENTS = {
//   employeesUpdated: 'employees-updated',
//   certificatesUpdated: 'certificates-updated',
// } as const;

// export function notifyEmployeesUpdated() {
//   window.dispatchEvent(
//     new Event(DATA_EVENTS.employeesUpdated),
//   );
// }

// export function notifyCertificatesUpdated() {
//   window.dispatchEvent(
//     new Event(DATA_EVENTS.certificatesUpdated),
//   );
// }



export const DATA_EVENTS = {
  employeesUpdated: 'employees-updated',
  certificatesUpdated: 'certificates-updated',
} as const;

export function notifyEmployeesUpdated() {
  console.log('Dispatching employees-updated');
  window.dispatchEvent(new Event('certificates-updated'));

  window.dispatchEvent(
    new Event(DATA_EVENTS.employeesUpdated),
  );
}

export function notifyCertificatesUpdated() {
  console.log('Dispatching certificates-updated');

  window.dispatchEvent(
    new Event(DATA_EVENTS.certificatesUpdated),
  );
}

// export function notifyEmployeesUpdated() {
//   console.log('Dispatching employees-updated');

//   window.dispatchEvent(
//     new Event('employees-updated'),
//   );
// }

// export function notifyCertificatesUpdated() {
//   console.log('Dispatching certificates-updated');

//   window.dispatchEvent(
//     new Event('certificates-updated'),
//   );
// }
// export function notifyCertificatesUpdated() {
//   console.log('Dispatching certificates-updated');

//   window.dispatchEvent(
//     new Event('certificates-updated'),
//   );
// }