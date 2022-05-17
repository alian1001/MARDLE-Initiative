from crypt import methods
from http.client import BAD_REQUEST
from flask import render_template, flash, redirect, url_for, request
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.urls import url_parse
from app import app, db
from app.forms import LoginForm, RegistrationForm
from app.models import User


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/game')
@login_required
def game():
    return render_template('game.html', title='Game')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', title='Profile')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('game'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('game')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        return render_template('logout.html')
    else:
        flash('failed')
        return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

'''
route for handling wordle guesses
'''
#@app.route('', methods=['GET', 'POST'])
def guess_wordle():
    args=request.args or {}
    if 'guess' not in args or not args['guess'].isalpha() or len(args['guess'])!=6:
        return bad_request('Guess must be a six letter word!')
    response=jsonify({"output":wordle_array(args['guess'].upper(), //target//)}) #need to import jsonify module
    return response

'''
guess array 
'''
#this function compares the guess word and the real word letter by letter
def wordle_array(guess, target):
    guess_array=[0]*6
    target_array=[True]*6

    for i in range(6):
        if guess[i]==target[i]:
            guess_array[i]=2
            target_array[i]=False
    for i, a in enumerate(guess):
        for j, b in enumerate(target):
            if a==b and guess_array[i]==0 and target_array[j]:
                guess_array[i]=1
                target_array[j]=False
    return guess_array
    