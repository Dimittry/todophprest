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
                <h1>{{user.username}}'s list </h1>
            </header>
			<!-- This section should be hidden by default and shown when there are todos -->
            <a class="back" href="/share/">Назад</a>
            <hr/>
            <section>
                <ul class="todo-list" data-userid="{{user.id}}">
                    {% for task in user.tasks %}
                        <li data-taskid="{{task.id}}" {% if task.completed == 1%} class="completed" {% endif %}>
                            <div class="view">
                                <input class="toggle" type="checkbox"
                                       {% if task.completed == 1%} checked {% endif %}>
                                <label>{{task.name}}</label>
                            </div>
                            <input class="edit" value="{{task.name}}">
                        </li>
                    {% endfor %}
                </ul>
            </section>
		</section>

        {% include 'includes/footer.php' %}

        <script src="/js/SharedList.js"></script>
        <script>
            SharedList.run();
        </script>
	</body>
</html>
