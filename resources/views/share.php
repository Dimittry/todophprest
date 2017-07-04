{% include 'includes/head.php' %}

<body>
        <header class="top-header">
            <div class="top-header-container">
                <div class="auth" style="display:block;">
                    <a href="/" class="nav-links" id="share">TODO List</a>
                </div>
            </div>

        </header>

		<section class="todoapp">
            <header class="header">
				<h1>share</h1>
				<input class="new-todo" placeholder="Enter your friend's name." autofocus>
			</header>
			<!-- This section should be hidden by default and shown when there are todos -->
			<section class="main">
				<input class="toggle-all" type="checkbox">
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<!-- These are here just to show the structure of the list items -->
					<!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
				</ul>
			</section>
		</section>
        {% if sharedUsers is not empty %}
            <section class="shared-data left">
                <p class="shared-data-title">Вы поделились своим списком с:</p>
                <ul class="todo-list">
                    {% for sharedTodo in sharedUsers %}
                        <li data-clientid="{{sharedTodo.client_id}}" >
                            <div class="view">
                                <input title="Разрешить редактирование" class="edit-allow toggle" type="checkbox"
                                       {% if sharedTodo.editable  == 1 %}checked{% endif %}>
                                <label>{{sharedTodo.username}}</label>
                            </div>
                        </li>
                    {% endfor %}
                </ul>
            </section>
        {% endif %}
        {% if sharingUsers is not empty %}
            <section class="shared-data right">
                <p class="shared-data-title">C вами поделились своим списком:</p>
                <ul class="todo-list">
                    {% for user in sharingUsers %}
                        <li data-clientid="{{user.id}}" >
                            <div class="view">
                                <label><a href="/share/{{user.id}}">{{user.username}}</a></label>
                            </div>
                        </li>
                    {% endfor %}
                </ul>
            </section>
        {% endif %}
        <div class="clear"></div>


        <div id="dialog-form" title="Sign in" style="display: none;">
            <p class="validateTips">All form fields are required.</p>

            <form class="user-credentials">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" value="" class="text ui-widget-content ui-corner-all">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all">

                <!-- Allow form submission with keyboard without duplicating the dialog button -->
                <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </form>
        </div>

        {% include 'includes/footer.php' %}

        <script src="/js/Share.js"></script>
        <script>
            Share.run();
        </script>
	</body>
</html>
