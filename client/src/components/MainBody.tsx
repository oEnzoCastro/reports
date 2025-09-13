import React from "react";

function Dashboard({ userClients }: { userClients: Client[] }) {
  const clients: Client[] = userClients;
  const reminders: Reminder[] = [];

  return (
    <section className="px-10 py-5 text-(--primary)">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <h2>Bem-vindo ao seu painel de controle</h2>
      </div>

      {/* Total de Clientes */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="rounded-md p-5 ring *:p-1">
            <h1 className="flex items-center gap-3">
              Total de Clientes
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 fill-(--primary)"
              >
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
              </svg>
            </h1>
            <h2>{clients.length}</h2>
            <a
              href=""
              className="hover:bg-(--primary)/20 rounded-md transition"
            >
              Ver mais
            </a>
          </div>
          {/* Add Cliente */}
          <div className="flex flex-col items-center rounded-md p-5 ring *:p-1">
            <h1 className="flex items-center gap-3">
              Adicionar Cliente
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 fill-(--primary)"
              >
                <path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z"></path>
              </svg>
            </h1>
            <button className="flex justify-center items-center w-2/3 h-full cursor-pointer bg-(--primary)/10 hover:bg-(--primary)/20 rounded-md transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-5 fill-(--primary)"
              >
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Tarefas Pendentes */}
        <div className="rounded-md p-5 ring *:p-1">
          <h1 className="flex items-center gap-3">
            Tarefas Pendentes
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-5 fill-(--primary)"
            >
              <path d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path>
            </svg>
          </h1>
          <ul className="bg-(--primary)/20 rounded-md">
            {reminders.map((reminder, index) => {
              return (
                <li key={"reminder" + index}>
                  <label
                    htmlFor={"reminder" + index}
                    className={`flex flex-nowrap p-2 gap-2 ${
                      index == 0 ? "" : "border-t border-(--primary)/10 "
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={"reminder" + index}
                      onChange={() => {}}
                      checked={reminder.ischecked}
                    />
                    <h1>{reminder.title}</h1>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function MainBody({ userClients }: { userClients: Client[] }) {
  return (
    <div className="flex">
      <Dashboard userClients={userClients} />
    </div>
  );
}
