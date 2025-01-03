describe('sum function', () => {
    it('should return the sum of two number', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

function sum(a: number, b: number) {
    return a + b;
}
