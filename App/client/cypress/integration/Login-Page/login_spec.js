describe("Login Test", function() {
    it('checks the login', function() {
        //Arrange
        cy.visit("http://localhost:3000/login")
        //Act
        cy.get("form").find('input[type= "submit"]').click()
        //Assert
        cy.get('input[type="email"]').type('me@email.com').focus().blur()

        cy.get('input[type="password"]').type('789456').blur()

        cy.get('form').children()

        cy.get('input[type="password"]').clear()
        cy.get('input[type="email"]').clear()

        cy.clock()
    })

    it("checks the Login Again", function() {
        cy.get('.form').debug()

        cy.document()

        cy.get('input').first().focus()

        cy.focused().should('have.attr', 'name').and('eq', 'email')
    })
})