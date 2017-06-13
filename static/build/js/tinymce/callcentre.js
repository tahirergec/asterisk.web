tinymce.PluginManager.add('spn_callcentre', function(editor, url)
{
    editor.addMenuItem('spn_callcentre_ami',
    {
        text: 'Добавить AMI действие',
        context: 'tools',
        onclick: function()
        {
            editor.windowManager.open(
            {
                title: 'Новое действие',
                body:
                [
                    {
                        type: 'listbox',
                        name: 'action_type',
                        label: 'Тип действия',
                        values:
                        [
                            {text: 'Перейти к шагу', value: 'goto'},
                            {text: 'Парковка + Звонок', value: 'parkcall'}
                        ]
                    },
                    {
                        type: 'textbox',
                        name: 'phone_number',
                        label: 'Номер телефона'
                    },
                    {
                        type: 'textbox',
                        name: 'step_number',
                        label: 'Номер шага'
                    },
                    {
                        type: 'textbox',
                        name: 'description',
                        label: 'Описание'
                    }

                ],
                onsubmit: function(e)
                {
                    switch(e.data.action_type)
                    {
                        case "goto":
                        {
                            if(!e.data.step_number.length)
                            {
                                alert('Введите номер шага');
                                return false;
                            }
                            if(!e.data.description.length)
                            {
                                alert('Введите описание');
                                return false;
                            }

                            editor.insertContent('<a href="javascript:WS.'+e.data.action_type+'(' + e.data.step_number + ')">' + e.data.description + '</a>');

                            break;
                        }

                        case "parkcall":
                        {
                            if(!e.data.phone_number.length)
                            {
                                alert('Введите номер телефона');
                                return false;
                            }
                            if(!e.data.description.length)
                            {
                                alert('Введите описание');
                                return false;
                            }

                            editor.insertContent('<a href="javascript:void(0)" click-to-call="' + e.data.phone_number + '">' + e.data.description + '</a>');

                            break;
                        }
                    }

                }
            });
        }
    });
});
