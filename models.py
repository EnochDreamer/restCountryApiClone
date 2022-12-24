from flask_sqlalchemy import SQLAlchemy


db=SQLAlchemy()

database_path='postgresql://postgres:Enochgenius7@localhost:5432/assignment'

def db_setup(app,Migrate,database_path=database_path,db=db):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    migrate=Migrate(app,db)
    return db

class Continents(db.Model):
    id=db.Column(db.Integer,primary_key=True,nullable=False)
    name=db.Column(db.String(),nullable=False)
    countries=db.relationship('Countries' , backref=db.backref('continent' , lazy='joined' ),passive_deletes=True)

    def format(self):
        return ({
            'id':self.id,
            'name':self.name
        })

class Countries(db.Model):
    id=db.Column(db.Integer ,primary_key=True,nullable=False)
    common_name=db.Column(db.String() ,nullable=False)
    population=db.Column(db.String ,nullable=False)
    currency=db.Column(db.String() ,nullable=False) 
    cca3=db.Column(db.String() ,nullable=False) 
    official_language=db.Column(db.String() ,nullable=False)
    continent_id=db.Column(db.Integer, db.ForeignKey('continents.id' , ondelete='CASCADE'), nullable=False)


    def format(self):
        return ({
            'id':self.id,
            'common_name':self.common_name,
            'population':self.population,
            'currency':self.currency,
            'cca3':self.cca3,
            'official_language':self.official_language,
            'continent':self.continent.name
        })

    

    def insert(self):
        db.session.add(self)
        db.session.commit()
        
    def close(self):
        db.session.close()
    
    def rollback(self):
        db.session.rollback()