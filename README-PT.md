Como implementei esta app.

1. Criar novo projecto cordova

2. Adicionei o plugin
https://github.com/nordnet/cordova-hot-code-push
através do comando `cordova plugin add https://github.com/nordnet/cordova-hot-code-push.git`

3. Uma vez que estamos em dev modo adicionei também este plugin:
`cordova plugin add cordova-hot-code-push-local-dev-addon`

**!!! Atenção que este plugin deve ser removido antes de fazer deploy da app.**

4. Instalei as cli tools para criar um servidor neste projecto.
`npm install -g cordova-hot-code-push-cli`

5. Lancei o servidor (a partir do root do projecto cordova)
   `cordova-hcp server`

   Isto irá produzir um output na linha de comando identico ao que se segue e irá também criar 2 ficheiros de configuração no /www

```
   Running server
   Checking:  /Users/marcio/Dev/_EXPERIENCES/_HOT_CODE_PUSH/foo/www
   local_url http://localhost:31284
```

   Sempre que mudamos o conteúdo do `/www` o cordova-hcp vai fazer um build e um deploy do conteúdo para o servidor.

   **Entre a app cliente e o servidor existe um socket**. Este permite ao cliente receber em tempo real novos updates.

   Se estivermos a fazer deploy de uma app com novas dependencias nativas (plugins) é importante não esquecer de aumentar o numero de versão da parte nativa.

`<native-interface version="1" />` -> `<native-interface version="2" />`

   Isso faz com que o cliente ignore essa versão.
   É uma boa prática interceptar os casos em que não é possível atualizar por causa da parte nativa e solicitar um update a partir da appStore. Isso pode ser feito através dos eventos e invocando o método `requestApplicationUpdate`.

6. Adicionei a configuração do chcp no config.xml

    ```
       <chcp>
                   <config-file url="http://192.168.0.190:31284/chcp.json" />
                   <native-interface version="1" />
                   <auto-download enabled="false" />
                   <auto-install enabled="false" />
               </chcp>
    ```

7. Do lado da aplicação cliente criei 2 botões
- Um botão para verificar
- Um botão para atualizar

8. Fiz `cordova run --device`

9. Para testar e já com a app aberta, fiz algumas alterações no meu index.html.
   O `cordova-hcp` detecta as alterações, faz o build, e envia-as para o servidor.

   O cliente detecta as alterações (por exemplo, clicando no fetchUpdate) e emite um confirm para informar o user que um novo update está disponível e se confirmar fará a instalação.

8. Se cancelarmos o update podemos sempre clicar no botão installUpdate para instalar manualmente.


**Como fazer o hosting e build da aplicação?**
Ver este artigo:
https://github.com/nordnet/cordova-hot-code-push/wiki/Build-options


**E se fizermos um release com novas deps da parte nativa?**
- Request application update through the store
Ler este artigo: https://github.com/nordnet/cordova-hot-code-push/wiki/Request-application-update-through-the-store

