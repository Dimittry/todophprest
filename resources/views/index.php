{% include 'includes/head.php' %}

<body>
        <header class="top-header">
            <div class="top-header-container">
                <div class="not-auth">
                    <a id="sign-in" class="sign auth-buttons nav-links" href="javascript:void(0);">Sign in</a>
                    <a id="sign-up" class="sign auth-buttons nav-links" href="javascript:void(0);">Sign up</a>
                </div>
                <div class="auth">
                    <a href="/share/" class="nav-links" id="share">Share</a>
                    <a id="logout" class="nav-links" href="javascript:void(0);">Logout</a>
                </div>
            </div>

        </header>
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" placeholder="What needs to be done?" autofocus>
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
			<!-- This footer should hidden by default and shown when there are todos -->
			<footer class="footer">
				<!-- This should be `0 items left` by default -->
				<span class="todo-count"><strong>0</strong> item left</span>
				<!-- Remove this if you don't implement routing -->
				<ul class="filters">
					<li>
						<a class="selected" href="#/">All</a>
					</li>
					<li>
						<a href="#/active">Active</a>
					</li>
					<li>
						<a href="#/completed">Completed</a>
					</li>
				</ul>
				<!-- Hidden if no completed items are left ↓ -->
				<button class="clear-completed">Clear completed</button>
			</footer>
		</section>

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


        <script src="/js/TaskTodo.js"></script>
        <script src="/js/TaskTodo.Dialog.js"></script>
        <script src="/js/TaskTodo.Nav.js"></script>
        <script src="/js/TaskTodo.List.js"></script>
        <script src="/js/TaskTodo.NewItem.js"></script>
        <script src="/js/TaskTodo.Auth.js"></script>
        <script src="/js/TaskTodo.Filter.js"></script>
		<script src="/js/app.js"></script>
	</body>
</html>
