const Sequence = require('../../lib/logoot/sequence');
const assert = require('assert');
const { describe, it } = require('mocha');

describe('Sequence', function() {
  describe('.compareAtomIdents', function() {
    it('returns -1 when less-than', function() {
      assert.equal(
        Sequence.compareAtomIdents(Sequence.min, Sequence.max),
        -1
      );
    });

    it('returns 0 when equal', function() {
      assert.equal(
        Sequence.compareAtomIdents(Sequence.min, Sequence.min),
        0
      );
    });

    it('returns 1 when greater-than', function() {
      assert.equal(
        Sequence.compareAtomIdents(Sequence.max, Sequence.min),
        1
      );
    });
  });

  describe('.emptySequence', function() {
    it('returns the empty sequence', function() {
      assert.deepEqual(
        Sequence.emptySequence(),
        [
          [[[[0, 0]], 0], null],
          [[[[32767, 0]], 1], null]
        ]
      )
    });
  });

  describe('.genAtomIdent', function() {
    it('returns a new atom ident between the two given', function() {
      const atomIdent = Sequence.genAtomIdent(1, 1, Sequence.min, Sequence.max);
      assertGreaterAtomIdent(atomIdent, Sequence.min);
      assertLesserAtomIdent(atomIdent, Sequence.max);
    });

    it('falls back to the min atom when necessary', function() {
      const atomIdent =
        Sequence.genAtomIdent(1, 1, Sequence.min, [[[0, 0], [1, 0]], 1]);
      assertGreaterAtomIdent(atomIdent, Sequence.min);
      assertLesserAtomIdent(atomIdent, [[[0, 0], [1, 0]], 1]);
    });
  });

  describe('.insertAtom', function() {
    it('inserts the atom into the sequence with the function', function() {
      const sequence = Sequence.emptySequence();
      const atomIdent = Sequence.genAtomIdent(1, 1, Sequence.min, Sequence.max);
      const atom = [atomIdent, "Hello, World"];
      const newSequence = Sequence.insertAtom(sequence, atom, insertMut);
      const expectedSequence =
       [[Sequence.min, null], atom, [Sequence.max, null]];

      assert.deepEqual(newSequence, expectedSequence);
    });

    it('inserts atoms in longer sequences', function() {
      const sequence = Sequence.emptySequence();
      const atomIdent = Sequence.genAtomIdent(1, 1, Sequence.min, Sequence.max);
      const atom = [atomIdent, "Hello, World"];
      const newSequence = Sequence.insertAtom(sequence, atom, insertMut);

      const atomBIdent = Sequence.genAtomIdent(1, 2, atomIdent, Sequence.max);
      const atomB = [atomBIdent, "Foo Bar"];
      const finalSequence = Sequence.insertAtom(newSequence, atomB, insertMut);
      const expectedSequence =
        [[Sequence.min, null], atom, atomB, [Sequence.max, null]];

      assert.deepEqual(finalSequence, expectedSequence);
    });
  });
});

function assertGreaterAtomIdent(identA, identB) {
  return assert.equal(Sequence.compareAtomIdents(identA, identB), 1);
}

function assertLesserAtomIdent(identA, identB) {
  return assert.equal(Sequence.compareAtomIdents(identA, identB), -1);
}

function insertMut(sequence, index, atom) {
  sequence.splice(index, 0, atom);
  return sequence;
}
