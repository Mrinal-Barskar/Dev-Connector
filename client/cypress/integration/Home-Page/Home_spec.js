describe('My First Test', function () {
    it('clicks an element', function() {
        //Arrange - setup Initial App State
        cy.visit("http://localhost:3000")

        cy.contains('h1', 'Developer Connector')
        cy.get('.buttons').contains('Sign Up', {matchCase : false}).click()

        cy.url().should('include', '/register')

        cy.get('nav').contains('DevConnector').click()

        cy.get('.buttons').contains('login', {matchCase : false}).and('be.visible')

        cy.get('nav').should('be.visible').and('have.class', 'bg-dark')
    })
})