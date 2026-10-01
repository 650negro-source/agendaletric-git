INSTALACIÓN Y CONFIGURACIÓN DE HERRAMIENTA DE VERSIONAMIENTO (LOCAL / WEB)

introduccion
el trabajo se hace con el fin de entender los comandos, necesarios para crear nuevos usuarios en git 
repositorios, local, remote con el fin de comprender cada uno de estos comandos de versionamiento para el proyecto de software y utilizarlo en cada cambio que se haga del proyecto. 

¿Qué es GIT?
Es un software de control de versiones, su propósito es llevar registro de los cambios en archivos de computadora y coordinar el trabajo que varias personas realizan sobre archivos compartidos (También puedes trabajar solo no hay problema 😃). Existe la posibilidad de trabajar de forma remota y una opción es GitHub.

¿Para qué usar GIT?
Permite regresar a versiones anteriores de forma sencilla y muy rápida.
Facilita el trabajo colaborativo.
Permite respaldar tus proyectos en la nube (ej con github).
Reduce considerablemente los tiempos de deploy.
Las "branches" o ramas, permiten trabajar con una base de código paralela al proyecto en sí.

¿Qué es GitHub?
Es una plataforma de desarrollo colaborativo para alojar proyectos (en la nube) utilizando el sistema de control de versiones Git, Además cuenta con una herramienta muy útil que es GitHub Pages donde podemos publicar nuestros proyectos estáticos (HTML, CSS y JS) gratis.

Registrar nuevo usuario asociado a git:

Para cambiar o agregar el nombre de usuario 👇🏽


git config --global user.name "mi nombre"
Es recomendable utilizar el correo asociado a Github


git config --global user.email "myemail@example.com"

Para verificar que se haya registrado correctamente:


git config user.name
git config user.email

Mi primer repositorio

// Iniciar un nuevo repositorio
// Crear la carpeta oculta .git
// Solo se ejecuta una vez por proyecto
git init

// Ver que archivos no han sido registrados
git status -s

// Agregar todos los archivos para que esté pendiente de los cambios
git add .

// Crear commit (fotografía del proyecto en ese momento)
git commit -m "primer commit"

// Muestra la lista de commit del mas reciente al más antigüo
git log --oneline
En resumidas cuentas nosotros realizamos cambios en nuestros archivos, el comando status verificará que archivos han sidos modificados. Cuando deseemos registrar esos cambios tendremos que agregarlos con add . así ya estará listo para poder hacer un commit. El commit realiza la copia de ese instante para poder volver en el tiempo si es que es necesario.

Crear repositorio (HTTPS)

git remote add origin https://github.com/bluuweb/tutorial-github.git

Push
Para futuros cambios y subir los registros a github ejecutar:


git add .
git commit -m "nuevo commit"
git push

git pull comando para bajar informacion del remoto al local y actualizar la informacion.

conclusion: 
se aprendio a manejar los comandos basicos para hacer el versionamiento del software como crear usuario enlazarlo con github, subir informacion, actualizar informacion, crear repositorios, ramas independientes de trabajo, actualizar desde remoto a local, y toda la informacionn requerida para llevar  a cabo dicho versionamiento, cabe destacar que con la practica se aprendera a tranbajar fluidamente con esta herramienta.