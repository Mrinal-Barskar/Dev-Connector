describe('My First Test', function () {
    it('clicks an element', function() {
        //Arrange - setup Initial App State
        cy.visit("https://example.cypress.io")

        cy.pause()

        //Act - take an action
        cy.contains('type').click()

        //Assert - make an assertion
        cy.url().should('include', '/commands/actions')

        cy.get('.action-email')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com')
    })
})